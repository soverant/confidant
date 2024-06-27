"use client"
import useSWR from "swr";
import { Client } from "@/app/lib/client";

export const usePoset = (nodeId: number) => {
    const { data, error, isLoading, mutate } = useSWR(`/poset/${nodeId}`, () =>
      Client.readNodeApiStudioPosetNodesNodeIdGet({ nodeId })
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
    Client.readNodeChildrenApiStudioPosetNodesNodeIdChildrenGet({ nodeId })
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
    Client.readNodeParentsApiStudioPosetNodesNodeIdParentsGet({ nodeId })
  );
  return {
    parents: data,
    isLoading,
    isError: error,
    mutate
  };
};


export const useProjects = () => {
  const { data, error, isLoading, mutate } = useSWR(`/project`, () =>
    Client.readAllProjectsApiStudioProjectsGet()
  );
  return {
    projects: data,
    isLoading,
    isError: error,
    mutate
  };
};