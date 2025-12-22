import { useState } from "react";

export default function useBoolean(initialState = false) {
	const [bool, setBool] = useState(initialState);

	const setTrue = () => setBool(true);
	const setFalse = () => setBool(false);
	const toggle = () => setBool((prev) => !prev);

	return{
    bool,
    setBool,
    setFalse,
    setTrue,
    toggle
  }
}