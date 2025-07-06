import { useEffect, useState } from "react";

export enum ViewType {
  Mobile = "mobile",
  //   Tablet = "tablet",
  Desktop = "desktop",
}

type ViewTypeOption =
  | ViewType.Desktop
  //   | DeviceType.Tablet
  | ViewType.Mobile;

export const useViewType = (viewTypeOption: ViewTypeOption) => {
  const query = (() => {
    switch (viewTypeOption) {
      case ViewType.Desktop:
        return "(min-width: 768px)";
      //   case DeviceType.Tablet:
      //     return "(min-width: 640px) and (max-width: 1023px)";
      case ViewType.Mobile:
        return "(max-width: 767px)";
      default:
        return "(max-width: 767px)";
    }
  })();
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQueryList.addEventListener("change", handleChange);

    if (mediaQueryList.matches !== matches) {
      setMatches(mediaQueryList.matches);
    }
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query, matches]);
  return matches;
};
