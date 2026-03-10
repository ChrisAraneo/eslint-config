import { get as getAppRootDir } from 'app-root-dir';

export const getTsconfigRootDir = (tsconfigRootDir?: string, shouldResolveAppRootDir?: boolean) => ({
    ...(tsconfigRootDir && !shouldResolveAppRootDir
        ? { tsconfigRootDir }
        : {}),
    ...(shouldResolveAppRootDir
        ? { tsconfigRootDir: getAppRootDir() }
        : {}),
});