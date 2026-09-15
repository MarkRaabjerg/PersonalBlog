import { pb } from "@/lib/pocketbase";
import type { Event } from "@/types/event";

export default async function Home() {
  const events: Event[] = await pb.collection("Events").getFullList({
    sort: "-Date",
  });

  return (
    <main className="min-h-screen bg-white text-[#080808]">
      {/* Header */}
      <header className="flex w-full flex-col items-center pt-12 sm:pt-15 md:pt-20 lg:pt-25">
        <div className="text-center font-serif text-[20px] font-normal leading-[1.2] sm:text-[30px] md:text-[40px] lg:text-[50px]">
          Mark Engelund Raabjerg
        </div>

        {/* Login */} <a href="/login" className=" absolute right-5 top-5 rounded-full border border-[#d2d2d2] px-4 py-2 text-[11px] transition-all duration-300 hover:bg-[#080808] hover:text-white sm:right-7 sm:top-7 sm:px-5 sm:py-2.5 sm:text-[12px] md:right-10 md:top-10 " > Login </a>

        <nav className="flex gap-4 sm:gap-6 md:gap-10 lg:gap-12 pt-4 sm:pt-6 md:pt-8 lg:pt-10">
          <a
            href="/"
            className="text-[12px] underline underline-offset-4 sm:text-[15px] md:text-[18px] lg:text-[20px]"
          >
            Blog
          </a>

          <a
            href="/about"
            className="text-[12px] sm:text-[15px] md:text-[18px] lg:text-[20px]"
          >
            About
          </a>
        </nav>
      </header>

      {/* Posts */}
      <section className="w-full pt-8 sm:pt-12 md:pt-18 lg:pt-24">
        {events.map((event) => {
          const imageUrl = pb.files.getURL(event, event.Cover_Image);

          console.log(
            "IMAGE URL:",
            event.Cover_Image
              ? pb.files.getURL(event, event.Cover_Image)
              : "NO IMAGE"
          );

          return (
            <article
              key={event.id}
              className="
              mx-3
              mb-4
              rounded-lg
              bg-[#f5f5f3]
              p-3
              sm:mx-4
              sm:mb-6
              sm:p-4
              md:mx-6
              md:mb-8
              lg:mx-10
              lg:mb-10
              lg:p-5"
            >
              {/* Cover image */}
              {event.Cover_Image && (
                <div className="flex justify-center">
                  <img
                    src={imageUrl}
                    alt={event.Title}
                    className="
                      block
                      h-auto
                      w-[90%]
                      max-w-[700px]
                      rounded-lg
                      sm:w-[90%]
                      md:w-[80%]
                      lg:w-[70%]
                    "
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="
                  mx-auto
                  mt-7
                  w-full
                  max-w-[calc(100%-32px)]
                  text-center
                  sm:mt-8
                  sm:max-w-[540px]
                  md:mt-9
                  md:max-w-[600px]
                  lg:mt-10
                  lg:max-w-[650px]
                "
              >

                {/* Date */}
                {event.Date && !isNaN(new Date(event.Date).getTime()) && (
                  <div className="text-[10px] leading-[1.5] sm:text-[11px]">
                    {new Date(event.Date).toLocaleDateString("en-US")}
                  </div>
                )}

                {/* Title */}
                <h1
                  className="
                    mt-3
                    mb-5
                    font-serif
                    text-[42px]
                    font-normal
                    leading-[0.92]
                    tracking-[-2px]
                    sm:text-[52px]
                    sm:tracking-[-2.5px]
                    md:text-[64px]
                    md:tracking-[-3px]
                    lg:text-[76px]
                    lg:tracking-[-4px]
                  "
                >
                  {event.Title}
                </h1>

                {/* Description */}
                <p
                  className="
                    mx-auto
                    max-w-[340px]
                    text-[12px]
                    leading-[1.5]
                    sm:max-w-[420px]
                    sm:text-[13px]
                    md:max-w-[480px]
                  "
                >
                  {event.Description}
                </p>

                {/* Read more */}
                <a
                  href={`/events/${event.Slug}`}
                  className="
                    mt-5
                    inline-block
                    text-[12px]
                    text-[#999]
                    underline
                    underline-offset-[3px]
                    transition-colors
                    hover:text-[#080808]
                    sm:mt-6
                    sm:text-[13px]
                  "
                >
                  Read More
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}