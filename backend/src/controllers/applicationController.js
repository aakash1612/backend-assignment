const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const {validStatusTransitions,} = require("../config/constants");
const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {

  const {
    student,
    program,
    university,
    destinationCountry,
    intake,
  } = req.body;

  // CHECK DUPLICATE APPLICATION
  const existingApplication =
    await Application.findOne({
      student,
      program,
      intake,
    });

  if (existingApplication) {
    throw new HttpError(
      400,
      "Application already exists for this intake."
    );
  }

  // CREATE APPLICATION
  const application =
    await Application.create({
      student,
      program,
      university,
      destinationCountry,
      intake,
    });

  res.status(201).json({
    success: true,
    data: application,
  });
});

const updateApplicationStatus =
  asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {
      status,
      note,
    } = req.body;

    // FIND APPLICATION
    const application =
      await Application.findById(id);

    if (!application) {
      throw new HttpError(
        404,
        "Application not found."
      );
    }

    const currentStatus =
      application.status;

    // VALIDATE TRANSITION
    const allowedTransitions =
      validStatusTransitions[currentStatus];

    if (
      !allowedTransitions.includes(status)
    ) {
      throw new HttpError(
        400,
        `Invalid status transition from ${currentStatus} to ${status}`
      );
    }

    // UPDATE STATUS
    application.status = status;

    // ADD TIMELINE ENTRY
    application.timeline.push({
      status,
      note:
        note ||
        `Application moved to ${status}`,
    });

    await application.save();

    res.json({
      success: true,
      data: application,
    });
  });

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus,
};
