export type fieldType = {
	id: string;
	name: string;
	type: "TEXT" | "IMAGE" | "AUDIO";
	isRequired: boolean;
	isQuestionField: boolean;
};

export type Deck = {
	id: string;
	name: string;
	fieldDefinitions: {
		id: string;
		fieldName: string;
		fieldType: "TEXT" | "IMAGE" | "AUDIO";
		isRequired: boolean;
		isQuestionField: boolean;
	}[];
};
