import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel', required: true
    },
    content: {
        type: String,
    },
    yjsState: {
        type: Buffer,
        required: false
    },
    editors: [
        {
            participantId: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

export const Document = mongoose.model("Document", documentSchema);