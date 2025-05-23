import type { z } from 'zod';
import type { GetAttachmentContract } from '../api/contracts';

export type Attachment = z.infer<typeof GetAttachmentContract>;
