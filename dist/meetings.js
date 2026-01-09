"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingsApi = void 0;
const config_1 = require("./config");
exports.meetingsApi = {
    async create(data, token) {
        try {
            const response = await fetch((0, config_1.getApiUrl)('/meetings'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create meeting');
            }
            return response.json();
        }
        catch (error) {
            (0, config_1.handleApiError)(error);
            throw error;
        }
    },
    async getByChamaId(chamaId, token) {
        try {
            const response = await fetch((0, config_1.getApiUrl)(`/meetings/chama/${chamaId}`), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch meetings');
            }
            return response.json();
        }
        catch (error) {
            (0, config_1.handleApiError)(error);
            throw error;
        }
    },
    async getAll(token) {
        try {
            const response = await fetch((0, config_1.getApiUrl)('/meetings'), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch meetings');
            }
            return response.json();
        }
        catch (error) {
            (0, config_1.handleApiError)(error);
            throw error;
        }
    },
    async getById(id, token) {
        try {
            const response = await fetch((0, config_1.getApiUrl)(`/meetings/${id}`), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch meeting');
            }
            return response.json();
        }
        catch (error) {
            (0, config_1.handleApiError)(error);
            throw error;
        }
    },
    async update(id, data, token) {
        try {
            const response = await fetch((0, config_1.getApiUrl)(`/meetings/${id}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update meeting');
            }
            return response.json();
        }
        catch (error) {
            (0, config_1.handleApiError)(error);
            throw error;
        }
    },
    async delete(id, token) {
        try {
            const response = await fetch((0, config_1.getApiUrl)(`/meetings/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete meeting');
            }
        }
        catch (error) {
            (0, config_1.handleApiError)(error);
            throw error;
        }
    },
};
//# sourceMappingURL=meetings.js.map