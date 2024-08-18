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
				<input
					{...createRef("name", "change")}
					type="text"
					className="w-full h-full border-gray-100 bg-transparent border rounded px-4 py-2"
				/>
				<input
					{...createRef("name1")}
					type="text"
					className="w-full h-full border-gray-100 bg-transparent border px-4 py-2 rounded"
				/>
				<input
					{...createRef("terms")}
					type="checkbox"
					className="w-full h-full border-gray-100 bg-transparent border px-4 py-2 rounded"
				/>

				<button
					type="submit"
					disabled={isDirty}
					className="w-full disabled:opacity-10 h-full bg-blue-500 text-white rounded px-4 py-2"
				>
					Submit
				</button>
			</form>
		</main>
	);
}
