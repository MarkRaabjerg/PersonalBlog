import type { RecordModel } from "pocketbase";
import type { Lens } from "@/types/lens";
import type { Camera } from "@/types/camera";


export interface Post extends RecordModel{
  id: string;
  Relation: string;
  Description: string;
  Image: string;
  Date: string;
  Location: string;
  Camera: string;
  Lens: string;
  Focal_Length: string;
  Aperture: string;
  ISO: string;
  Exposeure: string;
  Image_Orientation: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;

  expand?: {
    Camera?: Camera;
    Lens?: Lens;
  };
}