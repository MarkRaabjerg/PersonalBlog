import { notFound } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import type { Event } from "@/types/event";
import type { Post } from "@/types/post";
import type { Lens } from "@/types/lens";
import type { Camera } from "@/types/camera";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;

  let event: Event;
  let posts: Post[];

  try {
    // Find the event
    event = await pb
      .collection("Events")
      .getFirstListItem(`Slug="${slug}"`);

    // Find all posts related to this event
    posts = await pb.collection("Posts").getFullList<Post>({
      filter: `Relation="${event.id}"`,
      sort: "-Date",
      expand: "Camera,Lens",
    });
    console.log("POSTS:", JSON.stringify(posts, null, 2));
  } catch {
    notFound();
  }

const apertureIcons = [1.4, 1.7, 2, 2.8, 4, 8, 11];

const getClosestApertureIcon = (aperture: string | number) => {
  const value = Number(aperture);

  if (isNaN(value)) return null;

  return apertureIcons.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value)
      ? current
      : closest
  );
};

  const coverImageUrl = event.Cover_Image
    ? pb.files.getURL(event, event.Cover_Image)
    : null;

  return (
    <main className="min-h-screen bg-white text-[#080808]">
      {/* ================================
          EVENT HEADER
      ================================= */}

      <article className="pt-8 sm:pt-12 md:pt-16">

        {/* Event information */}
        <div
          className="
            mx-auto
            mt-10
            w-full
            max-w-[650px]
            px-5
            text-center
            sm:mt-12
            md:mt-16
          "
        >

          {/* Title */}
          <h1
            className="
              mt-2
              font-serif
              text-[48px]
              font-normal
              leading-[0.92]
              tracking-[-2px]
              sm:text-[60px]
              md:text-[72px]
              md:tracking-[-3px]
              lg:text-[76px]
              lg:tracking-[-4px]
            "
          >
            {event.Title}
          </h1>

          {/* Date */}
          {event.Date && !isNaN(new Date(event.Date).getTime()) && (
            <div className="text-[10px] leading-[1.5] sm:text-[11px]">
              {new Date(event.Date).toLocaleDateString("en-US")}
            </div>
          )}

          {/* Description */}
          <p
            className="
              mx-auto
              mt-3
              max-w-[480px]
              text-[13px]
              leading-[1.5]
            "
          >
            {event.Description}
          </p>
        </div>
      </article>

      {/* ================================
            POSTS GRID
        ================================= */}

        <section
          className="
            mx-auto
            mt-10
            w-full
            px-4
            sm:mt-12
            sm:px-6
            md:mt-15
            md:px-8
            lg:px-10
            lg:mt-20
            mb-10
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              md:grid-cols-2
              lg:grid-cols-2
              grid-flow-dense
            "
          >
            {posts.map((post) => {
              const postImageUrl = post.Image
                ? pb.files.getURL(post, post.Image)
                : null;

              if (!postImageUrl) return null;

              const isLandscape = post.Image_Orientation === "Landscape";

              return (
                <article
                  key={post.id}
                  className={`
                    col-span-1
                    rounded-lg
                    flex
                    items-center
                    flex-col
                    overflow-hidden
                    bg-[#f5f5f3]
                    p-3
                    sm:p-4
                    lg:p-5
                    ${isLandscape ? "sm:col-span-2" : "sm:col-span-1"}
                  `}
                >
                  {/* IMAGE + DESCRIPTION — stays at the top */}
                  <div>
                    <img
                      src={postImageUrl}
                      alt={post.Description || event.Title}
                      className="block h-auto w-full rounded object-contain"
                    />

                    <p
                      className="
                        mt-2
                        break-words
                        text-center
                        text-[15px]
                        leading-[1.5]
                        sm:text-[18px]
                        md:text-[20px]
                        lg:text-[22px]
                        mb-5
                      "
                    >
                      {post.Description}
                    </p>
                  </div>

                  {/* METADATA — pushed to bottom */}
                  <div className="mt-auto">
                    {/* Camera settings */}
                    <div
                      className="
                        flex
                        flex-wrap
                        justify-end
                        items-center
                        gap-x-3
                        gap-y-1
                        text-[13px]
                        text-gray-500
                        sm:text-[15px]
                      "
                    >
                      {post.Focal_Length && (
                        <span className="flex items-center gap-1">
                          <img
                            src="/icons/f1.4.svg"
                            alt="Aperture"
                            className="h-3 w-3"
                          />
                          {post.Focal_Length}mm
                        </span>
                      )}

                      {post.Aperture && (
                        <span className="flex items-center gap-1">
                          <img
                            src={`/icons/f${getClosestApertureIcon(post.Aperture)}.svg`}
                            alt=""
                            className="h-3.5 w-3.5"
                          />
                          {post.Aperture}
                        </span>
                      )}

                      {post.Exposure && (
                        <span className="flex items-center gap-1">
                          <img
                            src="/icons/shutter_speed.svg"
                            alt="Shutter Speed"
                            className="h-3 w-3"
                          />
                          {post.Exposure} s
                        </span>
                      )}

                      {post.ISO && (
                        <span className="flex items-center gap-1">
                          <img
                            src="/icons/iso.svg"
                            alt="ISO"
                            className="h-3 w-3"
                          />
                          {post.ISO}
                        </span>
                      )}
                    </div>

                    {/* Camera / Lens */}
                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        justify-end
                        gap-x-3
                        gap-y-1
                        text-[13px]
                        text-gray-500
                        sm:text-[15px]
                      "
                    >
                      {post.expand?.Camera && (
                        <span className="flex items-center gap-1">
                          <img
                            src="/icons/camera.svg"
                            alt="Camera"
                            className="h-3 w-3"
                          />
                          {post.expand.Camera.Camera_Name}
                        </span>
                      )}

                      {post.Lens && (
                        <span className="flex items-center gap-1">
                          <img
                            src="/icons/lens.svg"
                            alt="Lens"
                            className="h-3 w-3"
                          />
                          {post.expand?.Lens?.Lens_Name}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
    </main>
  );
}