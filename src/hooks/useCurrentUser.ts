"use client"
import { AppDispatch } from "@/features/store";
import { User } from "@/helpers/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {selectCurrentUser, fetchcurrentUser} from "@/features/userSlice"

export function useCurrentUser() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchcurrentUser())
  }, [dispatch]);

  return user;
}
