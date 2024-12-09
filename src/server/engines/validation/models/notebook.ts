// ---------------------------------------------------------------------------------------------------------------------
// Notebook Validation Model
// ---------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';

// Models
import { HashID } from './common';

// ---------------------------------------------------------------------------------------------------------------------

export const NotebookID = HashID;

export const NotebookPage = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    content: z.string().min(1),
    notebookID: NotebookID,
});

export const Notebook = z.object({
    id: NotebookID,
    pages: z.array(NotebookPage).optional(),
});

// ---------------------------------------------------------------------------------------------------------------------
// Request Validations
// ---------------------------------------------------------------------------------------------------------------------

export const RouteParams = z.object({
    noteID: NotebookID,
    pageID: z.string().min(1)
        .optional(),
});

export const NotebookFilter = z.object({
    id: z.union([ NotebookID, z.array(NotebookID) ]).optional(),
    email: z.union([ z.string().email(), z.array(z.string().email()) ])
        .optional(),
    name: z.union([ z.string().min(1), z.array(z.string().min(1)) ])
        .optional(),
});

// ---------------------------------------------------------------------------------------------------------------------
