import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerProfileData = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProfileData, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly infiction_username?: string | null;
  readonly email?: string | null;
  readonly dob?: string | null;
  readonly phone?: string | null;
  readonly highest_educatio?: string | null;
  readonly short_bio?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProfileData = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProfileData, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly infiction_username?: string | null;
  readonly email?: string | null;
  readonly dob?: string | null;
  readonly phone?: string | null;
  readonly highest_educatio?: string | null;
  readonly short_bio?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProfileData = LazyLoading extends LazyLoadingDisabled ? EagerProfileData : LazyProfileData

export declare const ProfileData: (new (init: ModelInit<ProfileData>) => ProfileData) & {
  copyOf(source: ProfileData, mutator: (draft: MutableModel<ProfileData>) => MutableModel<ProfileData> | void): ProfileData;
}