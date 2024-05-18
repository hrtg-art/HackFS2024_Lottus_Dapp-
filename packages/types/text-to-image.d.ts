declare module 'text-to-image' {
    interface Options {
      maxWidth?: number;
      fontSize?: number;
      fontFamily?: string;
      fontColor?: string;
      bgColor?: string;
    }
  
    export function generate(text: string, options: Options): Promise<string>;
  }
  