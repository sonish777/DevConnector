const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A profile must have a user"],
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "Please provide your status"],
  },
  skills: {
    type: [String],
    required: [true, "Please provide your skills"],
  },
  bio: {
    type: String,
  },
  githubUsername: {
    type: String,
  },
  experiences: [
    {
      title: {
        type: String,
        required: [true, "Please provide the title"],
      },
      company: {
        type: String,
        required: [true, "Please provide company name"],
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: [true, "Please provide the date"],
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldOfStudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

profileSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatar",
  });
  next();
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
