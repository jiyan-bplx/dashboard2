import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import { classNames } from "@utils/index";

interface AutoCompleteProps<T> {
	data: T[];
	label?: string;
	isLoading?: boolean;
	getLabel: (item: T) => string;
	onSelect: (item: T) => void;
	value?: T | null;
	id?: string;
	placeholder?: string;
	getVal: (item: T) => string;
}
export default function AutoComplete<T>({
	data,
	label,
	id,
	getLabel,
	getVal,
	placeholder,
	onSelect,
	value,
	isLoading,
}: AutoCompleteProps<
	T & {
		id: string | number;
	}
>) {
	const [query, setQuery] = useState("");

	const filteredItems = useMemo(
		() =>
			query === ""
				? data
				: data.filter((person) => {
						return getLabel(person)
							.toLowerCase()
							.includes(query.toLowerCase());
				  }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[query, data]
	);

	return (
		<Combobox as="div" value={value} onChange={onSelect}>
			{label && (
				<Combobox.Label className="block text-sm font-medium text-gray-700">
					{label}
				</Combobox.Label>
			)}
			<div className="relative mt-1">
				<Combobox.Input
					placeholder={placeholder}
					id={id}
					className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
					onChange={(event) => setQuery(event.target.value)}
					displayValue={(person) => getLabel(person as any)}
				/>
				<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<ChevronUpDownIcon
						className="h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</Combobox.Button>

				{isLoading ? (
					<Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{[1, 2, 3].map((item) => (
							<Combobox.Option
								key={item}
								value={item}
								className={({ active }) =>
									classNames(
										"relative cursor-default select-none py-2 px-3",

										"text-gray-900"
									)
								}
							>
								<div
									className={classNames(
										"w-full h-6 bg-gray-200 rounded-md animate-pulse"
									)}
									style={{
										// transitionDelay: `${item * 1000}ms`,
										animationDelay: `${item * 500}ms`,
									}}
								></div>
							</Combobox.Option>
						))}
					</Combobox.Options>
				) : (
					filteredItems.length > 0 && (
						<Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{filteredItems.map((person) => (
								<Combobox.Option
									key={person.id}
									value={person}
									className={({ active }) =>
										classNames(
											"relative cursor-default select-none py-2 pl-3 pr-9",
											active
												? "bg-indigo-600 text-white"
												: "text-gray-900"
										)
									}
								>
									{({ active, selected }) => (
										<>
											<span
												className={classNames(
													"block truncate",
													person.id === value?.id
														? "font-semibold"
														: ""
												)}
											>
												{getLabel(person)}
											</span>

											{selected && (
												<span
													className={classNames(
														"absolute inset-y-0 right-0 flex items-center pr-4",
														active
															? "text-white"
															: "text-indigo-600"
													)}
												>
													<CheckIcon
														className="h-5 w-5"
														aria-hidden="true"
													/>
												</span>
											)}
										</>
									)}
								</Combobox.Option>
							))}
						</Combobox.Options>
					)
				)}
			</div>
		</Combobox>
	);
}
