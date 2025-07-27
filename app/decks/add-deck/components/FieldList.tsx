'use client';
import { AnimatePresence, motion } from 'motion/react';
import DeckField from '../deck-field';
import { fieldType } from '../types';

interface FieldListProps {
    fields: fieldType[];
    toggleIsRequired: (idx: number) => void;
    toggleIsQuestionField: (idx: number) => void;
    moveUp: (idx: number) => void;
    moveDown: (idx: number) => void;
    changeName: (idx: number, newName: string) => void;
    removeField: (idx: number) => void;
}

export default function FieldList({ fields, toggleIsRequired, toggleIsQuestionField, moveUp, moveDown, changeName, removeField }: FieldListProps) {
    return (
        <div className="flex flex-col gap-2">
            <AnimatePresence presenceAffectsLayout>
                {fields.map((field, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            duration: 0.2,
                            delay: 0.1 * index,
                        }}
                    >
                        <DeckField
                            field={field}
                            indx={index}
                            toggleRequired={toggleIsRequired}
                            toggleIsQuestionField={toggleIsQuestionField}
                            moveUp={moveUp}
                            moveDown={moveDown}
                            changeName={changeName}
                            removeField={removeField}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
