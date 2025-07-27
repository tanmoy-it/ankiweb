"use client";
import LoadingSpinner from "@/app/util-components/loading-spinner";
import { memo } from "react";
import { SessionData } from "../types";
import NoStudySession from "./no-study-session-message";
import UnlearntCard from "./unlearnt-card";

const StudySession = memo(({ sessionData }: { sessionData: SessionData }) => {
	const unLearntCards = sessionData?.SessionCards.filter((card) => !card.islearnt);

	if (!sessionData.SessionCards) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<div className="w-full flex justify-center">
				{sessionData.SessionCards &&
				unLearntCards.length > 0 &&
				unLearntCards[0] ? (
					<UnlearntCard
						sessionData={sessionData}
						unLearntCards={unLearntCards}
					/>
				) : (
					<NoStudySession />
				)}
			</div>
		</div>
	);
});

StudySession.displayName = "StudySession";
export default StudySession;
