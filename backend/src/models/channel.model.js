import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        trim: true
    },
    channelAbout: {
        type: String
    },
    channelLogo: {
        type: String
    },
    channelAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    channelId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    participants: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            guestName: {
                type: String,
                trim: true
            },
            guestTempId: {
                type: String,
                sparse: true
            },
            isGuest: {
                type: Boolean,
                default: false
            },
            role: {
                type: String,
                enum: ['Viewer', 'Editor'],
                default: 'Viewer'
            },
            joinedAt: {
                type: Date,
            }
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    maxEditors: {
        type: Number,
        default: 3,
        min: 1
    },
    maxParticipants: {
        type: Number,
        default: 10
    },
    allowGuests: {
        type: Boolean,
        default: true
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document'
        }
    ]
}, { timestamps: true })

// Index for faster queries
channelSchema.index({ 'participants.user': 1 });
channelSchema.index({ 'participants.guestTempId': 1 });

// Virtual to get current active editors count
channelSchema.virtual('activeEditorsCount').get(function () {
    return this.participants.filter(p =>
        p.role === 'editor' && p.status === 'active'
    ).length;
});

// Virtual to get current active participants count
channelSchema.virtual('activeParticipantsCount').get(function () {
    return this.participants.filter(p => p.status === 'active').length;
});

// Method to check if channel can accept more editors
channelSchema.methods.canAddEditor = function () {
    const activeEditors = this.participants.filter(p =>
        p.role === 'editor' && p.status === 'active'
    ).length;
    return activeEditors < this.maxEditors;
};

// Method to check if channel can accept more participants
channelSchema.methods.canAddParticipant = function () {
    const activeParticipants = this.participants.filter(p =>
        p.status === 'active'
    ).length;
    return activeParticipants < this.maxParticipants;
};


export const Channel = mongoose.model("Channel", channelSchema);