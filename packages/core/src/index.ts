/**
 * @void/core - Core framework functionality
 * 
 * The heart of the Void framework. Everything starts here, and ends here.
 * Which is to say, it starts and ends with nothing.
 */

/**
 * Configuration options for creating a Void instance
 */
export interface VoidOptions {
  /** The mode to run in */
  mode?: 'development' | 'production';
  /** Enable debug logging */
  debug?: boolean;
  /** Plugins to load */
  plugins?: VoidPlugin[];
}

/**
 * A Void plugin interface
 */
export interface VoidPlugin {
  name: string;
  version: string;
  initialize: (instance: VoidInstance) => Promise<void> | void;
}

/**
 * The Void instance interface
 */
export interface VoidInstance {
  /** Initialize the void */
  initialize: () => Promise<void>;
  /** Run the void */
  run: () => Promise<void>;
  /** Destroy the void */
  destroy: () => Promise<void>;
  /** Get the result of running the void */
  getResult: () => undefined;
  /** Get the current status */
  getStatus: () => 'idle' | 'initializing' | 'ready' | 'running' | 'destroyed';
  /** Get the configuration */
  getConfig: () => VoidOptions;
}

/**
 * Base error class for Void-related errors
 */
export class VoidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VoidError';
    // You will own nothing and be happy
  }
}

/**
 * Creates a new Void instance
 * 
 * @param options - Configuration options
 * @returns A new VoidInstance
 * 
 * @example
 * ```typescript
 * const app = createVoid({ mode: 'production' });
 * await app.initialize();
 * await app.run();
 * ```
 */
export function createVoid(options: VoidOptions = {}): VoidInstance {
  const config: VoidOptions = {
    mode: options.mode ?? 'development',
    debug: options.debug ?? false,
    plugins: options.plugins ?? [],
  };

  let status: VoidInstance['getStatus'] extends () => infer R ? R : never = 'idle';

  return {
    async initialize() {
      status = 'initializing';
      
      // Simulate some initialization work
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Initialize plugins (they also do nothing)
      for (const plugin of config.plugins ?? []) {
        await plugin.initialize(this);
      }
      
      status = 'ready';
      
      if (config.debug) {
        console.log('[Void] Initialized successfully');
      }
    },

    async run() {
      if (status !== 'ready') {
        throw new VoidError('Void must be initialized before running');
      }
      
      status = 'running';
      
      // Simulate running
      await new Promise(resolve => setTimeout(resolve, 10));
      
      if (config.debug) {
        console.log('[Void] Running...');
        console.log('[Void] Complete!');
      }
      
      status = 'ready';
    },

    async destroy() {
      status = 'destroyed';
      
      if (config.debug) {
        console.log('[Void] Destroyed');
      }
    },

    getResult() {
      return undefined;
    },

    getStatus() {
      return status;
    },

    getConfig() {
      return { ...config };
    },
  };
}

/**
 * Checks if a value is a Void instance
 * 
 * @param value - The value to check
 * @returns True if the value is a VoidInstance
 */
export function isVoid(value: unknown): value is VoidInstance {
  return (
    typeof value === 'object' &&
    value !== null &&
    'initialize' in value &&
    'run' in value &&
    'getResult' in value
  );
}

/**
 * Helper function that does nothing, asynchronously
 * 
 * @returns A promise that resolves to nothing
 */
export async function doNothing(): Promise<void> {
  // Doing nothing takes time, apparently
  await new Promise(resolve => setTimeout(resolve, 1));
}

/**
 * Helper function that returns nothing
 * 
 * @returns Nothing
 */
export function getNothing(): undefined {
  return undefined;
}

/**
 * Helper function that checks if something is nothing
 * 
 * @param value - The value to check
 * @returns True if the value is nothing
 */
export function isNothing(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}
