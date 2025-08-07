// src/types/twitter.d.ts
declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          tweetId: string,
          targetElement: HTMLElement,
          options?: {
            theme?: 'light' | 'dark';
            conversation?: 'none' | 'all';
            cards?: 'hidden' | 'visible';
            width?: number;
            height?: number;
            align?: 'left' | 'center' | 'right';
            related?: string;
            lang?: string;
            chrome?: string[];
            dnt?: boolean;
          }
        ) => Promise<HTMLElement>;
        
        createTimeline: (
          source: {
            sourceType: string;
            screenName?: string;
            userId?: string;
            ownerScreenName?: string;
            slug?: string;
            id?: string;
            url?: string;
          },
          targetElement: HTMLElement,
          options?: {
            width?: number | 'auto';
            height?: number;
            theme?: 'light' | 'dark';
            linkColor?: string;
            borderColor?: string;
            tweetLimit?: number;
            showReplies?: boolean;
            chrome?: string[];
            ariaPolite?: 'polite' | 'assertive' | 'off';
          }
        ) => Promise<HTMLElement>;

        load: (targetElement?: HTMLElement) => void;
      };
      
      ready: (callback: () => void) => void;
    };
  }
}

export {};
