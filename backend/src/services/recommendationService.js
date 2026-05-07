const Program = require("../models/Program");
const Student = require("../models/Student");
const HttpError = require("../utils/httpError");

async function buildProgramRecommendations(studentId) {

  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const recommendations = await Program.aggregate([

    // FILTER RELEVANT PROGRAMS
    {
      $match: {
        country: { $in: student.targetCountries },
      },
    },

    // CALCULATE SCORES
    {
      $addFields: {

        countryScore: {
          $cond: [
            {
              $in: [
                "$country",
                student.targetCountries,
              ],
            },
            35,
            0,
          ],
        },

        fieldScore: {
          $cond: [
            {
              $in: [
                "$field",
                student.interestedFields,
              ],
            },
            30,
            0,
          ],
        },

        budgetScore: {
          $cond: [
            {
              $lte: [
                "$tuitionFeeUsd",
                student.maxBudgetUsd || 0,
              ],
            },
            20,
            0,
          ],
        },

        intakeScore: {
          $cond: [
            {
              $in: [
                student.preferredIntake,
                "$intakes",
              ],
            },
            10,
            0,
          ],
        },

        ieltsScore: {
          $cond: [
            {
              $lte: [
                "$minimumIelts",
                student.englishTest?.score || 0,
              ],
            },
            5,
            0,
          ],
        },
      },
    },

    // TOTAL SCORE
    {
      $addFields: {
        matchScore: {
          $add: [
            "$countryScore",
            "$fieldScore",
            "$budgetScore",
            "$intakeScore",
            "$ieltsScore",
          ],
        },
      },
    },

    // BUILD EXPLANATIONS
    {
      $addFields: {
        reasons: {
          $concatArrays: [

            {
              $cond: [
                { $gt: ["$countryScore", 0] },
                [
                  {
                    $concat: [
                      "Preferred country match: ",
                      "$country",
                    ],
                  },
                ],
                [],
              ],
            },

            {
              $cond: [
                { $gt: ["$fieldScore", 0] },
                [
                  {
                    $concat: [
                      "Field alignment: ",
                      "$field",
                    ],
                  },
                ],
                [],
              ],
            },

            {
              $cond: [
                { $gt: ["$budgetScore", 0] },
                ["Within budget range"],
                [],
              ],
            },

            {
              $cond: [
                { $gt: ["$intakeScore", 0] },
                [
                  {
                    $concat: [
                      "Preferred intake available: ",
                      student.preferredIntake || "",
                    ],
                  },
                ],
                [],
              ],
            },

            {
              $cond: [
                { $gt: ["$ieltsScore", 0] },
                [
                  "English test score meets requirement",
                ],
                [],
              ],
            },
          ],
        },
      },
    },

    // SORT BEST MATCHES
    {
      $sort: {
        matchScore: -1,
      },
    },

    // LIMIT RESULTS
    {
      $limit: 5,
    },

    // CLEAN RESPONSE
    {
      $project: {
        countryScore: 0,
        fieldScore: 0,
        budgetScore: 0,
        intakeScore: 0,
        ieltsScore: 0,
      },
    },
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        targetCountries:
          student.targetCountries,
        interestedFields:
          student.interestedFields,
      },
      recommendations,
    },
    meta: {
      recommendationEngine: "mongodb-aggregation",
      totalRecommendations:
        recommendations.length,
    },
  };
}

module.exports = {
  buildProgramRecommendations,
};