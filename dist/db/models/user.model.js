import mongoose from "mongoose";
import { GenderEnum, ProvidersEnum, RolesEnum, } from "../../utils/constants/enum.constants.js";
import ModelsNames from "../../utils/constants/models.names.js";
import { softDeleteFunction } from "../../utils/soft_delete/soft_delete.js";
import DocumentFormat from "../../utils/formats/document.format.js";
const OtpOrLinkObjectSchema = new mongoose.Schema({
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    count: { type: Number, required: true },
}, { _id: false });
const ProfilePictureSchema = new mongoose.Schema({
    url: { type: String, requird: true },
    provider: {
        type: String,
        enum: Object.values(ProvidersEnum),
        default: ProvidersEnum.local,
    },
}, { _id: false });
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 25 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 25 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    confirmedAt: { type: Date },
    confirmEmailLink: {
        type: OtpOrLinkObjectSchema,
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === ProvidersEnum.local;
        },
    },
    forgetPasswordOtp: {
        type: OtpOrLinkObjectSchema,
    },
    forgetPasswordVerificationExpiresAt: { type: Date },
    lastResetPasswordAt: { type: Date },
    changeCredentialsTime: { type: Date },
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        required: function () {
            return this.authProvider === ProvidersEnum.local;
        },
    },
    role: {
        type: String,
        enum: Object.values(RolesEnum),
        default: RolesEnum.user,
    },
    authProvider: {
        type: String,
        enum: Object.values(ProvidersEnum),
        default: ProvidersEnum.local,
    },
    phoneNumber: {
        type: String,
        required: function () {
            return this.authProvider === ProvidersEnum.local;
        },
    },
    dateOfBirth: { type: Date },
    profilePicture: {
        type: ProfilePictureSchema,
    },
    coverImages: [String],
    education: { type: String },
    skills: { type: [String], default: [] },
    coursesAndCertifications: { type: [String], default: [] },
    careerPathId: { type: mongoose.Schema.Types.ObjectId, ref: "CareerPath" },
    freezed: {
        at: Date,
        by: { type: mongoose.Schema.Types.ObjectId, ref: ModelsNames.userModel },
    },
    restored: {
        at: Date,
        by: { type: mongoose.Schema.Types.ObjectId, ref: ModelsNames.userModel },
    },
}, {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema
    .virtual("fullName")
    .get(function () {
    return `${this.firstName} ${this.lastName}`;
})
    .set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.set({ firstName, lastName });
});
userSchema.methods.toJSON = function () {
    const userObject = DocumentFormat.getIdFrom_Id(this.toObject());
    return {
        id: userObject.id,
        fullName: userObject.firstName
            ? `${userObject.firstName} ${userObject.lastName}`
            : undefined,
        email: userObject.email,
        phoneNumber: userObject.phoneNumber,
        gender: userObject.gender,
        role: userObject.role,
        profilePicture: userObject.profilePicture,
        createdAt: userObject.createdAt,
        updatedAt: userObject.updatedAt,
        confirmedAt: userObject.confirmedAt,
    };
};
userSchema.pre(["find", "findOne", "findOneAndUpdate", "countDocuments"], function (next) {
    softDeleteFunction(this);
    console.log({ query: this.getQuery() });
    next();
});
const UserModel = mongoose.models?.User ||
    mongoose.model(ModelsNames.userModel, userSchema);
export default UserModel;
