"use client"
import useSWR from "swr";
import { Services } from "@/app/lib/client";

export const usePoset = (nodeId: number) => {
    const { data, error, isLoading, mutate } = useSWR(`/poset/${nodeId}`, () =>
      Services.readNodeApiStudioPosetNodesNodeIdGet({ nodeId })
    );
    return {
      poset: data,
      isLoading,
      isError: error,
      mutate
    };
  };

export const usePosetChildrens = (nodeId: number) => {
  const { data, error, isLoading, mutate } = useSWR(`/poset/children/${nodeId}`, () =>
    Services.readNodeChildrenApiStudioPosetNodesNodeIdChildrenGet({ nodeId })
  );
  return {
    childrens: data,
    isLoading,
    isError: error,
    mutate
  };
};

export const usePosetParents = (nodeId:number) => {
  const { data, error, isLoading, mutate } = useSWR(`/poset/parent/${nodeId}`, () =>
    Services.readNodeParentsApiStudioPosetNodesNodeIdParentsGet({ nodeId })
  );
  return {
    parents: data,
    isLoading,
    isError: error,
    mutate
  };
};
