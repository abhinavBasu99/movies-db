import { useState, useEffect } from "react";

export default function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    return JSON.parse(localStorage.getItem(key)) || initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
