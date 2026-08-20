const RESET = "\u001b[0m";
const COLORS = {
  cyan: "\u001b[36m",
  blue: "\u001b[34m",
  yellow: "\u001b[33m",
  green: "\u001b[32m",
  red: "\u001b[31m",
} as const;

const useColor = Boolean(process.stdout.isTTY) && !("NO_COLOR" in process.env);

const colorize = (value: string | number, color: keyof typeof COLORS) =>
  useColor ? `${COLORS[color]}${value}${RESET}` : String(value);

const statusColor = (statusCode: number): keyof typeof COLORS => {
  if (statusCode >= 500) return "red";
  if (statusCode >= 400) return "yellow";
  if (statusCode >= 300) return "cyan";
  return "green";
};

export const logger = {
  api(method: string, path: string, statusCode: number, durationMs: number) {
    console.log(
      `${colorize("[API]", "cyan")} ${method} ${path} ${colorize(
        statusCode,
        statusColor(statusCode)
      )} ${durationMs}ms`
    );
  },
  info(message: string) {
    console.info(`${colorize("[INFO]", "blue")} ${message}`);
  },
  warn(message: string) {
    console.warn(`${colorize("[WARN]", "yellow")} ${message}`);
  },
};
