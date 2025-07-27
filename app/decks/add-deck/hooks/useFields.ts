'use client';
import { useState } from 'react';
import { fieldType } from '../types';

export function useFields(initialFields: fieldType[] = []) {
    const [fields, setFields] = useState<fieldType[]>(initialFields);

    const toggleIsRequired = (idx: number) => {
        setFields(prevFields =>
            prevFields.map((field, index) =>
                index === idx ? { ...field, isRequired: !field.isRequired } : field
            )
        );
    };

    const toggleIsQuestionField = (idx: number) => {
        setFields(prevFields =>
            prevFields.map((field, index) =>
                index === idx ? { ...field, isQuestionField: !field.isQuestionField } : field
            )
        );
    };

    const moveUp = (idx: number) => {
        if (idx === 0) return;
        setFields(prevFields => {
            const newFields = [...prevFields];
            [newFields[idx - 1], newFields[idx]] = [newFields[idx], newFields[idx - 1]];
            return newFields;
        });
    };

    const moveDown = (idx: number) => {
        if (idx === fields.length - 1) return;
        setFields(prevFields => {
            const newFields = [...prevFields];
            [newFields[idx + 1], newFields[idx]] = [newFields[idx], newFields[idx + 1]];
            return newFields;
        });
    };

    const addField = (type: 'TEXT' | 'IMAGE' | 'AUDIO') => {
        const newField: fieldType = {
            id: crypto.randomUUID(),
            name: `${type} FieldName`,
            type: type,
            isRequired: false,
            isQuestionField: false,
        };
        setFields(prevFields => [...prevFields, newField]);
    };

    const removeField = (idx: number) => {
        setFields(prevFields => prevFields.filter((_, index) => index !== idx));
    };

    const changeName = (idx: number, newName: string) => {
        setFields(prevFields =>
            prevFields.map((field, index) =>
                index === idx ? { ...field, name: newName } : field
            )
        );
    };

    return {
        fields,
        setFields,
        addField,
        removeField,
        changeName,
        moveUp,
        moveDown,
        toggleIsRequired,
        toggleIsQuestionField,
    };
}
