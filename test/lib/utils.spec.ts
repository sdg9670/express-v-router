import { expect } from 'chai';
import Utils from '../../lib/utils';

describe('Util', () => {
  it('compareVersion', () => {
    const exampleVersions = [
      '2.0',
      '3.5.5',
      '3.5.4',
      '3.5.5',
      '3.5.3',
      '3',
      '4.5.6',
      '2.1.2',
      '4.5.7',
      '1.0.2',
    ];
    expect(exampleVersions.sort(Utils.compareVersion)).to.deep.equal([
      '1.0.2',
      '2.0',
      '2.1.2',
      '3',
      '3.5.3',
      '3.5.4',
      '3.5.5',
      '3.5.5',
      '4.5.6',
      '4.5.7',
    ]);

    expect(Utils.compareVersion('2.0.4', '2.0.4')).to.equal(0);
    expect(Utils.compareVersion('2.0.5', '2.0.4')).to.equal(1);
    expect(Utils.compareVersion('2.0.3', '2.0.4')).to.equal(-1);
  });

  it('replaceVersionDotToHyphen', () => {
    const exampleVersions = [
      '2.0',
      '3.5.5',
      '3.5.4',
      '3.5.5',
      '3.5.3',
      '3',
      '4.5.6',
      '2.1.2',
      '4.5.7',
      '1.0.2',
    ];
    expect(
      exampleVersions.map((e) => Utils.replaceVersionDotToHyphen(e))
    ).to.deep.equal([
      '2-0',
      '3-5-5',
      '3-5-4',
      '3-5-5',
      '3-5-3',
      '3',
      '4-5-6',
      '2-1-2',
      '4-5-7',
      '1-0-2',
    ]);
  });
});
