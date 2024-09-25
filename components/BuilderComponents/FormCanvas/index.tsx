import { getPlanLimits } from "@api/subscriptions";
import InputItem from "@components/BuilderComponents/InputItem";
import { useDroppable } from "@dnd-kit/core";
import { classNames } from "@utils/index";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useBuilderStore, { useFormOptionsStore } from "@store/builder";
import { InputTypeWithoutIcon } from "../../../types";

const FormCanvas = ({
	isQuiz,
	page,
	disableDrop,
}: {
	isQuiz?: boolean;
	disableDrop?: boolean;
	page: number;
}) => {
	const theme = useFormOptionsStore((state) => state.formOptions.theme);
	const { selectedInput, setSelectedInput, inputs, setInputs } =
		useBuilderStore((state) => state);

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	const isAvailable = (inputKey: string) => {
		return planLimits?.data?.limits?.allowed_inputs?.includes(inputKey);
	};

	const { setNodeRef } = useDroppable({
		id: `page-${page}`,
		disabled: disableDrop,
		data: {
			type: "page",
			pageId: page,
			//   index: props.index,
		},
	});

	const onDeleteInput = (item: InputTypeWithoutIcon) => {
		const newInputs = [...inputs];
		const indexOfInput = newInputs.findIndex(
			(input) => input.id === item.id
		);

		// Check if current input is used in any condition
		const isLinked = newInputs.filter((input) => {
			const conditions = input.conditions || [];
			return conditions.some(
				(condition) => condition.actionElement === item.id
			);
		});

		if (isLinked.length > 0) {
			if (isLinked.at(0)) {
				toast.error(
					"This input is used in a condition. Please remove the condition first."
				);
				setTimeout(() => {
					setSelectedInput(isLinked.at(0)!);
					document
						.getElementById("field-conditions")
						?.scrollIntoView({ behavior: "smooth" });
				}, 100);
				setTimeout(() => {
					document
						.getElementById(`conditions-submit-btn-${item.id}`)
						?.focus();
				}, 200);
			}
			return;
		}

		newInputs.splice(indexOfInput, 1);

		setInputs(
			newInputs.map((input, i) => ({
				...input,
				index: i,
				id: input.id ?? i.toString(),
			}))
		);

		setTimeout(() => {
			setSelectedInput(null);
		}, 100);
	};

	return (
		<div className="w-full min-w-full flex flex-wrap" ref={setNodeRef}>
			{inputs?.filter((item) => {
				if (typeof item.page === "number") {
					return item.page === page;
				} else {
					if (page === 1) return true;
					return false;
				}
			})?.length === 0 ? (
				<div className="px-4">
					<p
						className={classNames(
							theme === "dark"
								? "text-gray-200"
								: "text-gray-800",
							"mt-2 font-medium"
						)}
					>
						Your {isQuiz ? "quiz" : "form"} is empty.
					</p>
					<p
						className={classNames(
							theme === "dark"
								? "text-gray-400"
								: "text-gray-500",
							"text-sm font-normal"
						)}
					>
						Add some {isQuiz ? "questions" : "inputs"}.
					</p>
				</div>
			) : (
				inputs
					?.filter((item) => {
						if (typeof item.page === "number") {
							return item.page === page;
						} else {
							if (page === 1) return true;
							return false;
						}
					})
					?.map((item, index) => (
						<InputItem
							isAvailable={isAvailable(item.type)}
							isSelected={item.id === selectedInput?.id}
							index={index}
							key={item.id.toString()}
							input={{ ...item, readOnly: true }}
							isPreview={true}
							onDelete={() => onDeleteInput(item)}
						/>
					))
			)}
		</div>
	);
};

export default FormCanvas;
