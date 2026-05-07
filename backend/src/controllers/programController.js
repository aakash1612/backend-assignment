const Program = require("../models/Program");
const asyncHandler = require("../utils/asyncHandler");

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

const listPrograms = asyncHandler(async (req, res) => {
const {
  country,
  degreeLevel,
  intake,
  field,
  q,
  search,
  minTuition,
  maxTuition,
  scholarshipAvailable,
  sortBy = "tuitionFeeUsd",
  sortOrder = "asc",
  page = 1,
  limit = 10,
} = req.query;

  const filters = {};

  if (country) {
    filters.country = country;
  }

  if (degreeLevel) {
    filters.degreeLevel = degreeLevel;
  }

  if (field) {
    filters.field = field;
  }

  if (intake) {
    filters.intakes = intake;
  }
if (minTuition || maxTuition) {

  filters.tuitionFeeUsd = {};

  if (minTuition) {
    filters.tuitionFeeUsd.$gte =
      Number(minTuition);
  }

  if (maxTuition) {
    filters.tuitionFeeUsd.$lte =
      Number(maxTuition);
  }
}

  const scholarshipFlag = parseBoolean(scholarshipAvailable);
  if (typeof scholarshipFlag === "boolean") {
    filters.scholarshipAvailable = scholarshipFlag;
  }

const searchTerm = search || q;

if (searchTerm) {

  filters.$or = [
    {
      title: {
        $regex: searchTerm,
        $options: "i",
      },
    },
    {
      universityName: {
        $regex: searchTerm,
        $options: "i",
      },
    },
    {
      field: {
        $regex: searchTerm,
        $options: "i",
      },
    },
  ];
}

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);

 const sortOptions = {};

sortOptions[sortBy] =
  sortOrder === "desc" ? -1 : 1;

  const [items, total] = await Promise.all([
    Program.find(filters)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Program.countDocuments(filters),
  ]);

  res.json({
    success: true,
    count: items.length,
    data: items,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage:
      pageNumber < Math.ceil(total / pageSize),
      hasPrevPage: pageNumber > 1,
},
  });
});

module.exports = {
  listPrograms,
};
