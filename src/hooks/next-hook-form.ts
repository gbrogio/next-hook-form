import * as React from "react";

type SchemaType = Record<string, any>;

export function useForm<T extends SchemaType>(opts: { schema: T }) {
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [inputsValues, setInputValues] = React.useState<
		{ name: keyof T; value: string | boolean | null }[]
	>([]);

	const inputs = {} as Record<keyof T, React.RefObject<any>>;

	function getInputAndValue(name: keyof T) {
		if (!inputs[name]) return { input: null, value: null };
		const input = inputs[name].current as HTMLInputElement;
		if (input.type === "checkbox") return { input, value: input.checked };
		return { input, value: input.value };
	}

	function handleInputErrorParser(
		name: keyof T,
		{ input, value }: ReturnType<typeof getInputAndValue>,
	) {
		try {
			opts.schema[name]?.parse(value);

			input?.setCustomValidity("");
			return false;
		} catch (err: any) {
			const error = err?.issues?.[0]?.message || "Invalid input";
			input?.setCustomValidity(error);
			input?.reportValidity();
			return error;
		}
	}

	return {
		getValue: (name: keyof T) => getInputAndValue(name).value,
		getInput: (name: keyof T) => getInputAndValue(name).input,
		isPending,
		error,
		watch: (names: (keyof T)[]) =>
			inputsValues.filter((item) => names.includes(item.name)),
		isDirty: inputsValues
			.filter((item) =>
				typeof item.value === "string" ? !item.value.length : false,
			)
			.some((v) => v),
		handleSubmit:
			(cb: (inputs: any, error: string | null) => Promise<void>) =>
			(ev: React.FormEvent<HTMLFormElement>) => {
				ev.preventDefault();
				setIsPending(true);
				let error = null;
				for (const name in inputs) {
					const input = getInputAndValue(name);
					error = handleInputErrorParser(name as keyof T, input);
					if (error) break;
				}
				if (error) return cb(null, error).finally(() => setIsPending(true));
				cb({}, null).finally(() => setIsPending(true));
			},
		setError: (error: string | null, name?: keyof T) => {
			if (name) {
				const input = inputs[name].current as HTMLInputElement;
				if (!error) {
					input.setCustomValidity("");
					return;
				}
				input.setCustomValidity(error);
				input.reportValidity();
			} else {
				setError(error);
			}
		},
		createRef: <K extends keyof T>(
			name: K,
			dispareErrorOn: "submit" | "change" = "submit",
		) => {
			if (name in inputs)
				throw new Error(`Duplicate input name: ${name as string}`);
			const ref = React.createRef<HTMLInputElement>();
			inputs[name] = ref;

			return {
				ref,
				name,
				onChange: () => {
					const input = getInputAndValue(name);
					inputs[name].current.setCustomValidity("");
					setInputValues((prev) => {
						const newPrev = [...prev];
						const inputIndex = newPrev.findIndex((v) => v.name === name);
						if (inputIndex !== -1) {
							newPrev[inputIndex].value = input.value;
							return [...newPrev];
						}

						newPrev.push({
							name,
							value: input.value,
						});

						return [...newPrev];
					});
					if (dispareErrorOn === "change") handleInputErrorParser(name, input);
				},
			};
		},
	};
}
