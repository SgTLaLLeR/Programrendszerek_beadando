import {AnyZodObject, z, ZodArray, ZodError, ZodObject} from "zod";

export async function zParse<T extends AnyZodObject | ZodArray<ZodObject<any>>>(
  schema: T,
  data: Request | any,
): Promise<z.infer<T>> {
  try {
    return schema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.message);
    }
    return new Error(JSON.stringify(error));
  }
}

export async function parseZodError(error: ZodError) : Promise<string> {
  try {
    const msg = JSON.parse(error.message);
    const messages = msg.map((m: any) => m.message);
    return messages.join(', ');
  } catch (e) {
    return '';
  }
}

export async function parseZodError_backend(error: ZodError) : Promise<string> {
  try {
    return error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', ');
  } catch (e) {
    return "Something went wrong at parseZodError " + e;
  }
}
