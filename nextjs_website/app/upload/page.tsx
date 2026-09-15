"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import type { Event } from "@/types/event";
import type { Camera } from "@/types/camera";
import type { Lens } from "@/types/lens";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [lenses, setLenses] = useState<Lens[]>([]);

  // Event form
  const [eventTitle, setEventTitle] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventCover, setEventCover] = useState<File | null>(null);

  // Post form
  const [selectedEvent, setSelectedEvent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImageOrientation, setPostImageOrientation] = useState<"Landscape" | "Portrait">(
    "Landscape"
  );
  const [postDescription, setPostDescription] = useState("");
  const [postDate, setPostDate] = useState("");

  const [focalLength, setFocalLength] = useState("");
  const [aperture, setAperture] = useState("");
  const [exposure, setExposure] = useState("");
  const [iso, setIso] = useState("");
  const [camera, setCamera] = useState("");
  const [lens, setLens] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // CHECK LOGIN
  // ============================================================

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.replace("/login");
      return;
    }

    loadEvents();
  }, [router]);

  async function loadEvents() {
    try {
      const eventResult = await pb
        .collection("Events")
        .getFullList<Event>({
          sort: "-Date",
          requestKey: null,
        });

      const cameraResult = await pb
        .collection("Cameras")
        .getFullList<Camera>({
          requestKey: null,
        });

      const lensResult = await pb
        .collection("Lenses")
        .getFullList<Lens>({
          requestKey: null,
        });

      setEvents(eventResult);
      setCameras(cameraResult);
      setLenses(lensResult);

      if (eventResult.length > 0) {
        setSelectedEvent(eventResult[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load events, cameras, or lenses.");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // CREATE EVENT
  // ============================================================

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("Title", eventTitle);
      formData.append("Slug", eventSlug);
      formData.append("Description", eventDescription);

      if (eventDate) {
        formData.append("Date", eventDate);
      }

      if (eventCover) {
        formData.append("Cover_Image", eventCover);
      }

      const event = await pb.collection("Events").create<Event>(formData);

      setEvents((current) => [event, ...current]);
      setSelectedEvent(event.id);

      setEventTitle("");
      setEventSlug("");
      setEventDescription("");
      setEventDate("");
      setEventCover(null);

      setMessage("Event created successfully.");
      } catch (err: any) {
        console.error("Event CREATION ERROR:", err);
        console.error("POCKETBASE RESPONSE:", err?.response);

        setError(
          err?.response
            ? JSON.stringify(err.response)
            : "Could not create event."
        );
      }
      finally {
      setSubmitting(false);
    }
  }

  // ============================================================
  // CREATE POST
  // ============================================================

  async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!selectedEvent) {
      setError("Please select an event.");
      return;
    }

    if (!postImage) {
      setError("Please select an image.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("Relation", selectedEvent);
      formData.append("Image", postImage);

      formData.append("Image_Orientation", postImageOrientation);

      if (postDescription) {
        formData.append("Description", postDescription);
      }

      if (postDate) {
        formData.append("Date", postDate);
      }

      if (focalLength) {
        formData.append("Focal_Length", focalLength);
      }

      if (aperture) {
        formData.append("Aperture", aperture);
      }

      if (exposure) {
        formData.append("Exposure", exposure);
      }

      if (iso) {
        formData.append("ISO", iso);
      }

      if (camera) {
        formData.append("Camera", camera);
      }

      if (lens) {
        formData.append("Lens", lens);
      }

      await pb.collection("Posts").create(formData);

      setPostImage(null);
      setPostDescription("");
      setPostDate("");
      setFocalLength("");
      setAperture("");
      setExposure("");
      setIso("");
      setCamera("");
      setLens("");

    } catch (err: any) {
      console.error("POST CREATION ERROR:", err);
      console.error("POCKETBASE RESPONSE:", err?.response);

      setError(
        err?.response
          ? JSON.stringify(err.response)
          : "Could not upload post."
      );
    }
    finally {
      setSubmitting(false);
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function logout() {
    pb.authStore.clear();
    router.push("/");
    router.refresh();
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <div className="text-[13px] text-[#6e6e73]">
          Loading...
        </div>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      {/* HEADER */}
      <header
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#d2d2d7]
          bg-white
          px-5
          py-5
          sm:px-8
        "
      >
        <a
          href="/"
          className="
            font-serif
            text-[20px]
            tracking-[-0.5px]
            transition-opacity
            hover:opacity-60
          "
        >
          Mark Engelund Raabjerg
        </a>

        <button
          onClick={logout}
          className="
            rounded-full
            border
            border-[#d2d2d7]
            px-4
            py-2
            text-[12px]
            transition
            hover:bg-[#1d1d1f]
            hover:text-white
          "
        >
          Log out
        </button>
      </header>

      {/* CONTENT */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1000px]
          px-5
          py-10
          sm:px-8
          sm:py-14
          md:py-20
        "
      >
        {/* TITLE */}
        <div className="mb-10">
          <p
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-[#6e6e73]
            "
          >
            Admin
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-[42px]
              leading-[0.95]
              tracking-[-2px]
              sm:text-[56px]
              md:text-[64px]
            "
          >
            Manage your photography.
          </h1>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 rounded-xl bg-[#eaf7ed] px-4 py-3 text-[13px] text-[#26733b]">
            {message}
          </div>
        )}

        {/* ======================================================
            CREATE EVENT
        ====================================================== */}

        <section className="mb-8 rounded-[24px] bg-white p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="mt-2 font-serif text-[32px] tracking-[-1px]">
              New event
            </h2>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Title
              </label>

              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                placeholder="Summer in Copenhagen"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  px-4
                  text-[14px]
                  outline-none
                  transition
                  focus:border-[#1d1d1f]
                "
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Slug
              </label>

              <input
                type="text"
                value={eventSlug}
                onChange={(e) => setEventSlug(e.target.value)}
                required
                placeholder="summer-in-copenhagen"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  px-4
                  text-[14px]
                  outline-none
                  transition
                  focus:border-[#1d1d1f]
                "
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Date
              </label>

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-[#1d1d1f]
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Description
              </label>

              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={4}
                placeholder="A short description..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  px-4
                  py-3
                  text-[14px]
                  outline-none
                  focus:border-[#1d1d1f]
                "
              />
            </div>

            {/* Cover */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Cover image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEventCover(e.target.files?.[0] ?? null)
                }
                className="
                  block
                  w-full
                  text-[13px]
                  text-[#6e6e73]
                "
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="
                h-12
                w-full
                rounded-xl
                bg-[#1d1d1f]
                text-[13px]
                font-medium
                text-white
                transition
                hover:bg-[#333336]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitting ? "Creating..." : "Create event"}
            </button>
          </form>
        </section>

        {/* ======================================================
            CREATE POST
        ====================================================== */}

        <section className="rounded-[24px] bg-white p-6 sm:p-8">
          <div className="mb-8">

            <h2 className="mt-2 font-serif text-[32px] tracking-[-1px]">
              New post
            </h2>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-5">
            {/* Event */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Event
              </label>

              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                required
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  bg-white
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-[#1d1d1f]
                "
              >
                <option value="" disabled>
                  Select an event
                </option>

                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.Title}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Photograph
              </label>

              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setPostImage(e.target.files?.[0] ?? null)
                }
                className="
                  block
                  w-full
                  text-[13px]
                  text-[#6e6e73]
                "
              />
            </div>

            {/* Orientation */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Orientation
              </label>

              <select
                value={postImageOrientation}
                onChange={(e) =>
                  setPostImageOrientation(
                    e.target.value as "Landscape" | "Portrait"
                  )
                }
                required
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  bg-white
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-[#1d1d1f]
                "
              >
                <option value="Landscape">Landscape</option>
                <option value="Portrait">Portrait</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Description
              </label>

              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                rows={4}
                placeholder="Describe the photograph..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  px-4
                  py-3
                  text-[14px]
                  outline-none
                  focus:border-[#1d1d1f]
                "
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Date
              </label>

              <input
                type="date"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#d2d2d7]
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-[#1d1d1f]
                "
              />
            </div>

            {/* CAMERA SETTINGS */}
            <div>
              <label className="mb-2 block text-[12px] font-medium">
                Camera
              </label>

              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="..."
              >
                <option value="">Select a camera</option>

                {cameras.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.Camera_Name}
                  </option>
                ))}
              </select>
            </div>

                {/* Lens */}
                <div>
                  <label className="mb-2 block text-[12px] font-medium">
                    Lens
                  </label>

                  <select
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                    className="..."
                  >
                    <option value="">Select a lens</option>

                    {lenses.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.Lens_Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Focal length */}
                <div>
                  <label className="mb-2 block text-[12px] font-medium">
                    Focal length
                  </label>

                  <input
                    type="text"
                    value={focalLength}
                    onChange={(e) => setFocalLength(e.target.value)}
                    placeholder="35"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#d2d2d7]
                      px-4
                      text-[14px]
                      outline-none
                      focus:border-[#1d1d1f]
                    "
                  />
                </div>

                {/* Aperture */}
                <div>
                  <label className="mb-2 block text-[12px] font-medium">
                    Aperture
                  </label>

                  <input
                    type="text"
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    placeholder="1.4"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#d2d2d7]
                      px-4
                      text-[14px]
                      outline-none
                      focus:border-[#1d1d1f]
                    "
                  />
                </div>

                {/* Shutter */}
                <div>
                  <label className="mb-2 block text-[12px] font-medium">
                    Shutter speed
                  </label>

                  <input
                    type="text"
                    value={exposure}
                    onChange={(e) => setExposure(e.target.value)}
                    placeholder="1/250"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#d2d2d7]
                      px-4
                      text-[14px]
                      outline-none
                      focus:border-[#1d1d1f]
                    "
                  />
                </div>

                {/* ISO */}
                <div>
                  <label className="mb-2 block text-[12px] font-medium">
                    ISO
                  </label>

                  <input
                    type="text"
                    value={iso}
                    onChange={(e) => setIso(e.target.value)}
                    placeholder="100"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#d2d2d7]
                      px-4
                      text-[14px]
                      outline-none
                      focus:border-[#1d1d1f]
                    "
                  />
                </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="
                mt-3
                h-12
                w-full
                rounded-xl
                bg-[#1d1d1f]
                text-[13px]
                font-medium
                text-white
                transition
                hover:bg-[#333336]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitting ? "Uploading..." : "Upload photograph"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}