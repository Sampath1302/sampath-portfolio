import { Composition } from "remotion";
import { FILM_FPS, FILM_SECONDS, films } from "../../lib/films";
import { CaseFile, type Format } from "./CaseFile";
const formats: { format: Format; width: number; height: number }[] = [
  { format: "wide", width: 1280, height: 720 },
  { format: "square", width: 1080, height: 1080 },
];

// One composition per film and format, e.g. "qurik-wide", "qurik-square"
export function Root() {
  return (
    <>
      {films.flatMap((film) =>
        formats.map(({ format, width, height }) => (
          <Composition
            key={`${film.slug}-${format}`}
            id={`${film.slug}-${format}`}
            component={CaseFile}
            defaultProps={{ slug: film.slug, format }}
            durationInFrames={FILM_SECONDS * FILM_FPS}
            fps={FILM_FPS}
            width={width}
            height={height}
          />
        ))
      )}
    </>
  );
}
