import type {
  Renderer,
  PartialStoryFn as StoryFunction,
  StoryContext,
} from "@storybook/types";
import { useEffect, useMemo, useGlobals } from "@storybook/preview-api";
import { PARAM_KEY } from "./constants";

import { clearStyles, addOutlineStyles } from './helpers';

import outlineCSS from './OutlineCSS';

export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>
) => {
  const [globals] = useGlobals();
  const myAddon = globals[PARAM_KEY];
  const isInDocs = context.viewMode === "docs";
  const isActive = [true, 'true'].includes(myAddon);

  const outlineStyles = useMemo(() => {
    const selector = isInDocs ? `#anchor--${context.id} .sb-story` : '#storybook-root';

    return outlineCSS(selector);
  }, [context.id]);

  useEffect(() => {
    const selectorId = isInDocs ? `my-addon-docs-${context.id}` : `my-addon`;

    if (!isActive) {
      clearStyles(selectorId);
      return;
    }

    addOutlineStyles(selectorId, outlineStyles);

    return () => {
      clearStyles(selectorId);
    };
  }, [isActive, outlineStyles, context.id]);

  return StoryFn();
};
