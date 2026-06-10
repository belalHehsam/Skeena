import { useMutation } from "@tanstack/react-query";
import { analyzePost } from "../services/analyzePost";
import type { AnalyzePostResponse } from "../types/post";

export function useAnalyzePost() {
	return useMutation<AnalyzePostResponse, any, FormData>({
		mutationFn: analyzePost,
	});
}
