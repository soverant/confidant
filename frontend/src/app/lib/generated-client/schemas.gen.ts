// This file is auto-generated by @hey-api/openapi-ts

export const $Chat = {
    properties: {
        id: {
            anyOf: [
                {
                    type: 'string',
                    format: 'uuid'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Id'
        },
        created_at: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Created At',
            readOnly: true,
            nullable: true
        },
        modified_at: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Modified At',
            readOnly: true,
            nullable: true
        },
        confidant_id: {
            type: 'integer',
            maximum: 9223372036854776000,
            minimum: -9223372036854776000,
            title: 'Confidant Id'
        },
        messages: {
            items: {
                '$ref': '#/components/schemas/leaf'
            },
            type: 'array',
            title: 'Messages'
        }
    },
    additionalProperties: false,
    type: 'object',
    required: ['id', 'confidant_id', 'messages'],
    title: 'Chat'
} as const;

export const $CreateUpdateDeleteSuccessful = {
    properties: {
        id: {
            type: 'integer',
            title: 'Id'
        }
    },
    type: 'object',
    required: ['id'],
    title: 'CreateUpdateDeleteSuccessful'
} as const;

export const $Edge = {
    properties: {
        id: {
            type: 'integer',
            title: 'Id'
        },
        from_node: {
            type: 'integer',
            title: 'From Node'
        },
        to_node: {
            type: 'integer',
            title: 'To Node'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        modified_at: {
            type: 'string',
            format: 'date-time',
            title: 'Modified At'
        }
    },
    type: 'object',
    required: ['id', 'from_node', 'to_node', 'created_at', 'modified_at'],
    title: 'Edge'
} as const;

export const $EdgeCreate = {
    properties: {
        from_node: {
            type: 'integer',
            title: 'From Node'
        },
        to_node: {
            type: 'integer',
            title: 'To Node'
        }
    },
    type: 'object',
    required: ['from_node', 'to_node'],
    title: 'EdgeCreate'
} as const;

export const $EdgeUpdate = {
    properties: {
        from_node: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'From Node'
        },
        to_node: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'To Node'
        }
    },
    type: 'object',
    title: 'EdgeUpdate'
} as const;

export const $HTTPValidationError = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            type: 'array',
            title: 'Detail'
        }
    },
    type: 'object',
    title: 'HTTPValidationError'
} as const;

export const $MessageIn = {
    properties: {
        created_at: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Created At',
            readOnly: true,
            nullable: true
        },
        modified_at: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Modified At',
            readOnly: true,
            nullable: true
        },
        content: {
            type: 'string',
            title: 'Content'
        },
        sender_type: {
            type: 'string',
            maxLength: 9,
            title: 'Sender Type',
            description: 'USER: user<br/>CONFIDANT: confidant<br/>SYSTEM: system'
        },
        sender: {
            type: 'string',
            maxLength: 50,
            title: 'Sender'
        },
        chat_id: {
            type: 'string',
            format: 'uuid',
            title: 'Chat Id'
        }
    },
    additionalProperties: false,
    type: 'object',
    required: ['content', 'sender_type', 'sender', 'chat_id'],
    title: 'MessageIn'
} as const;

export const $Node = {
    properties: {
        id: {
            type: 'integer',
            title: 'Id'
        },
        title: {
            type: 'string',
            title: 'Title'
        },
        prompt: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Prompt'
        },
        response: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Response'
        },
        spec: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spec'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        modified_at: {
            type: 'string',
            format: 'date-time',
            title: 'Modified At'
        }
    },
    type: 'object',
    required: ['id', 'title', 'created_at', 'modified_at'],
    title: 'Node'
} as const;

export const $NodeCreate = {
    properties: {
        title: {
            type: 'string',
            title: 'Title'
        },
        prompt: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Prompt'
        },
        response: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Response'
        },
        spec: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spec'
        }
    },
    type: 'object',
    required: ['title'],
    title: 'NodeCreate'
} as const;

export const $NodeUpdate = {
    properties: {
        title: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Title'
        },
        prompt: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Prompt'
        },
        response: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Response'
        },
        spec: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spec'
        }
    },
    type: 'object',
    title: 'NodeUpdate'
} as const;

export const $Project = {
    properties: {
        id: {
            type: 'integer',
            title: 'Id'
        },
        title: {
            type: 'string',
            title: 'Title'
        },
        description: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Description'
        },
        root_node_id: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Root Node Id'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        modified_at: {
            type: 'string',
            format: 'date-time',
            title: 'Modified At'
        }
    },
    type: 'object',
    required: ['id', 'title', 'description', 'root_node_id', 'created_at', 'modified_at'],
    title: 'Project'
} as const;

export const $ProjectCreate = {
    properties: {
        title: {
            type: 'string',
            title: 'Title'
        },
        description: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Description'
        },
        root_node_id: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Root Node Id'
        }
    },
    type: 'object',
    required: ['title'],
    title: 'ProjectCreate'
} as const;

export const $ProjectUpdate = {
    properties: {
        title: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Title'
        },
        description: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Description'
        },
        root_node_id: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Root Node Id'
        }
    },
    type: 'object',
    title: 'ProjectUpdate'
} as const;

export const $ValidationError = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            type: 'array',
            title: 'Location'
        },
        msg: {
            type: 'string',
            title: 'Message'
        },
        type: {
            type: 'string',
            title: 'Error Type'
        }
    },
    type: 'object',
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError'
} as const;

export const $leaf = {
    properties: {
        id: {
            anyOf: [
                {
                    type: 'string',
                    format: 'uuid'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Id'
        },
        created_at: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Created At',
            readOnly: true,
            nullable: true
        },
        modified_at: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Modified At',
            readOnly: true,
            nullable: true
        },
        content: {
            type: 'string',
            title: 'Content'
        },
        sender_type: {
            type: 'string',
            maxLength: 9,
            title: 'Sender Type',
            description: 'USER: user<br/>CONFIDANT: confidant<br/>SYSTEM: system'
        },
        sender: {
            type: 'string',
            maxLength: 50,
            title: 'Sender'
        }
    },
    additionalProperties: false,
    type: 'object',
    required: ['id', 'content', 'sender_type', 'sender'],
    title: 'Messages'
} as const;