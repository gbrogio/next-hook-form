# useForm Hook

The `useForm` is a custom hook for managing forms in React, with support for schema validation using the `zod` library.

## Installation

To use `useForm`, you need to have React and Zod installed in your project.

```sh
npm install next-hook-form zod
```

## Usage

Here is an example of how to use `useForm` in a React component:

```tsx
"use client";

import { useForm } from "@/hooks/next-hook-form";
import * as React from "react";
import { z } from "zod";

export default function Home() {
  const { createRef, handleSubmit, isDirty, watch, isPending } = useForm({
    schema: {
      name: z.string().min(20),
      name1: z.string().min(30),
      terms: z.boolean().refine((v) => v, "Fill terms!"),
    },
  });

  return (
    <main className="h-screen flex items-center justify-center bg-gray-950 text-white">
      <form onSubmit={handleSubmit(async () => {})} className="space-y-4">
        <input {...createRef("name", "change")} type="text" />
        <input {...createRef("name1")} type="text" />
        <input {...createRef("terms")} type="checkbox" />

        <button type="submit" disabled={isDirty}>
          Submit
        </button>
      </form>
    </main>
  );
}
```

## API

### `useForm`

```typescript
function useForm<T extends SchemaType>(opts: {
  schema: T;
}): {
  createRef: <K extends keyof T>(
    name: K,
    dispareErrorOn?: "submit" | "change"
  ) => {
    ref: React.RefObject<HTMLInputElement>;
    name: K;
    onChange: () => void;
  };
  handleSubmit: (
    cb: (inputs: any, error: string | null) => Promise<void>
  ) => (ev: React.FormEvent<HTMLFormElement>) => void;
  isDirty: boolean;
  watch: (
    names: (keyof T)[]
  ) => { name: keyof T; value: string | boolean | null }[];
  isPending: boolean;
  error: string | null;
  setError: (error: string | null, name?: keyof T) => void;
  getValue: (name: keyof T) => string | boolean | null;
  getInput: (name: keyof T) => HTMLInputElement | null;
};
```

#### Parameters

- `opts`: An object containing the validation schema.

#### Returns

- `createRef`: Creates a reference for an input field.
- `handleSubmit`: Handles form submission.
- `isDirty`: Indicates if any form field is dirty.
- `watch`: Watches the values of specified fields.
- `isPending`: Indicates if the form is in a pending state.
- `error`: Contains the current error message.
- `setError`: Sets an error message for a specific field or the entire form.
- `getValue`: Gets the value of a specific field.
- `getInput`: Gets the reference of a specific field.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
