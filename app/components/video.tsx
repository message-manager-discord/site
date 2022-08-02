import { useEffect, useState } from "react";

export default function Video({
  src,
  mobileSrc,
}: {
  src: string;
  mobileSrc: boolean;
}) {
  // All videos should have both `webm` and `mp4`
  // The path is the path without the extension
  // This allows for possible faster videos, but a fallback that will work on all

  // Sometimes mp4 is smaller than webm, then we should disable webm

  // Mov -> webm ffmpeg -i input.mov -vcodec libvpx-vp9 -b:v 1M output.webm
  // mov -> mp4 ffmpeg -i input.mov -vcodec h264 -acodec aac -strict -2 -an output.mp4
  //ffmpeg -i delete-dark-mobile-1.mp4 -vcodec h264 -acodec aac -strict -2 -an delete-dark-mobile.mp4

  //ffmpeg -i fetch.mov -c:v libvpx-vp9 -pass 1 -b:v 1000K -threads 8 -speed 4 -tile-columns 6 -frame-parallel 1 -an -f webm /dev/null
  // ffmpeg -i fetch.mov -c:v libvpx-vp9 -pass 2 -b:v 1000K -threads 8 -speed 1 \\n  -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 \\n  -c:a libopus -b:a 64k -f webm fetch.webm

  const [mobile, setMobile] = useState(false);

  const shouldUseMobile = mobile && mobileSrc;

  const { resolvedTheme } = { resolvedTheme: "dark" }; // TODO: Fix all this

  // Listen for window resize events and set the correct mobile state
  useEffect(() => {
    const setCorrectMobile = () => {
      if (window.innerWidth < 768 && !mobile) {
        setMobile(true);
      }
      if (window.innerWidth >= 768 && mobile) {
        setMobile(false);
      }
    };
    setCorrectMobile();
    window.addEventListener("resize", setCorrectMobile);
    return () => {
      window.removeEventListener("resize", setCorrectMobile);
    };
  }, [mobile]);
  const source = src
    .replace("{theme}", resolvedTheme ? resolvedTheme : "light")
    .replace("{platform}", shouldUseMobile ? "mobile" : "desktop");

  return (
    <div className="flex flex-col w-full items-center md:px-12 mt-2">
      {mobile && !mobileSrc && (
        <p className="text-red-500 dark:text-red-200 text-sm">
          There is no mobile version of this video! Showing the desktop version.
        </p>
      )}
      <video
        autoPlay={false}
        loop
        muted
        controls={true}
        src={`${source}.mp4`}
        itemType="video/mp4"
        className="rounded-lg max-h-screen "
      />
    </div>
  );
  /*
  return (
    // If mobile and mobileSrc isn't set then we show an error and the desktop version
    // If mobile, and mobileSrc is set, then we show the mobile version
    // If not mobile, we show the desktop version
    <>
      {mobile && !mobileSrc && (
        <p className="text-red-500 dark:text-red-200 text-sm">
          There is no mobile version of this video! Showing the desktop version.
        </p>
      )}
      <video autoPlay loop muted controls={false}>
        {webm && (
          <source src={`${source}.webm`} type="video/webm; codecs=vp9,vorbis" />
        )}
        <source src={`${source}.mp4`} type="video/mp4" />
      </video>
    </>
  );*/
}
