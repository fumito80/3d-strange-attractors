// Runge-Kutta method

import * as R from 'ramda'; 

type DiffArgFun = { (a: number, b: number, dt: number): number };

const diffArgFun = (divided: number) => (a: number, b: number, dt: number) => a + b * dt / divided;
const diffArgFuns: DiffArgFun[] = [
  R.identity as DiffArgFun,
  diffArgFun(2),
  diffArgFun(2),
  diffArgFun(1),
];

function getRKResult(diffs: XYZ[], col: number, dt: number) {
  return diffs[0][col] + (diffs[1][col] + 2 * diffs[2][col] + 2 * diffs[3][col] + diffs[4][col]) * dt / 6;
}

export function rK(xyz: XYZ, { diff, dt }: IAttractor) {
  const [x, y, z] = xyz;
  const diffs = diffArgFuns.reduce((acc, fun) => {
    const [diffX, diffY, diffZ] = R.last(acc) as XYZ;
    const input = [fun(x, diffX, dt), fun(y, diffY, dt), fun(z, diffZ, dt)] as XYZ;
    return acc.concat([diff(input)]);
  }, [xyz]);

  return xyz.map((_, i) => getRKResult(diffs, i, dt)) as XYZ;
}
