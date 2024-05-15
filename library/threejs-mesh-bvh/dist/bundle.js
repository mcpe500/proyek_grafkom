/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/three-mesh-bvh@0.7.4/src/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */

const {
  BufferAttribute: t,
  Vector3: e,
  Vector2: n,
  Plane: r,
  Line3: o,
  Triangle: i,
  Sphere: s,
  Matrix4: a,
  Box3: c,
  BackSide: u,
  DoubleSide: l,
  FrontSide: d,
  Group: f,
  LineBasicMaterial: h,
  MeshBasicMaterial: p,
  Object3D: y,
  BufferGeometry: m,
  Mesh: x,
  Ray: g,
  DataTexture: b,
  NearestFilter: v,
  UnsignedIntType: w,
  IntType: B,
  FloatType: A,
  UnsignedByteType: T,
  UnsignedShortType: M,
  ByteType: P,
  ShortType: I,
  RGBAFormat: _,
  RGBAIntegerFormat: S,
  RGFormat: D,
  RedFormat: F,
  RGIntegerFormat: z,
  RedIntegerFormat: U,
  Matrix3: E,
  Vector4: N,
} = THREE;
const k = 0,
  C = 1,
  H = 2,
  q = 0,
  V = 1,
  O = 2,
  R = 1.25,
  W = 1,
  G = 32,
  X = 65535,
  L = Math.pow(2, -24),
  Y = Symbol("SKIP_GENERATION");
function Z(t) {
  return t.index ? t.index.count : t.attributes.position.count;
}
function j(t) {
  return Z(t) / 3;
}
function K(t, e = ArrayBuffer) {
  return t > 65535
    ? new Uint32Array(new e(4 * t))
    : new Uint16Array(new e(2 * t));
}
function $(t) {
  const e = j(t),
    n = t.drawRange,
    r = n.start / 3,
    o = (n.start + n.count) / 3,
    i = Math.max(0, r),
    s = Math.min(e, o) - i;
  return [{ offset: Math.floor(i), count: Math.floor(s) }];
}
function J(t) {
  if (!t.groups || !t.groups.length) return $(t);
  const e = [],
    n = new Set(),
    r = t.drawRange,
    o = r.start / 3,
    i = (r.start + r.count) / 3;
  for (const e of t.groups) {
    const t = e.start / 3,
      r = (e.start + e.count) / 3;
    n.add(Math.max(o, t)), n.add(Math.min(i, r));
  }
  const s = Array.from(n.values()).sort((t, e) => t - e);
  for (let t = 0; t < s.length - 1; t++) {
    const n = s[t],
      r = s[t + 1];
    e.push({ offset: Math.floor(n), count: Math.floor(r - n) });
  }
  return e;
}
function Q(t, e, n, r, o) {
  let i = 1 / 0,
    s = 1 / 0,
    a = 1 / 0,
    c = -1 / 0,
    u = -1 / 0,
    l = -1 / 0,
    d = 1 / 0,
    f = 1 / 0,
    h = 1 / 0,
    p = -1 / 0,
    y = -1 / 0,
    m = -1 / 0;
  for (let r = 6 * e, o = 6 * (e + n); r < o; r += 6) {
    const e = t[r + 0],
      n = t[r + 1],
      o = e - n,
      x = e + n;
    o < i && (i = o), x > c && (c = x), e < d && (d = e), e > p && (p = e);
    const g = t[r + 2],
      b = t[r + 3],
      v = g - b,
      w = g + b;
    v < s && (s = v), w > u && (u = w), g < f && (f = g), g > y && (y = g);
    const B = t[r + 4],
      A = t[r + 5],
      T = B - A,
      M = B + A;
    T < a && (a = T), M > l && (l = M), B < h && (h = B), B > m && (m = B);
  }
  (r[0] = i),
    (r[1] = s),
    (r[2] = a),
    (r[3] = c),
    (r[4] = u),
    (r[5] = l),
    (o[0] = d),
    (o[1] = f),
    (o[2] = h),
    (o[3] = p),
    (o[4] = y),
    (o[5] = m);
}
function tt(t, e, n) {
  return (
    (n.min.x = e[t]),
    (n.min.y = e[t + 1]),
    (n.min.z = e[t + 2]),
    (n.max.x = e[t + 3]),
    (n.max.y = e[t + 4]),
    (n.max.z = e[t + 5]),
    n
  );
}
function et(t) {
  let e = -1,
    n = -1 / 0;
  for (let r = 0; r < 3; r++) {
    const o = t[r + 3] - t[r];
    o > n && ((n = o), (e = r));
  }
  return e;
}
function nt(t, e) {
  e.set(t);
}
function rt(t, e, n) {
  let r, o;
  for (let i = 0; i < 3; i++) {
    const s = i + 3;
    (r = t[i]),
      (o = e[i]),
      (n[i] = r < o ? r : o),
      (r = t[s]),
      (o = e[s]),
      (n[s] = r > o ? r : o);
  }
}
function ot(t, e, n) {
  for (let r = 0; r < 3; r++) {
    const o = e[t + 2 * r],
      i = e[t + 2 * r + 1],
      s = o - i,
      a = o + i;
    s < n[r] && (n[r] = s), a > n[r + 3] && (n[r + 3] = a);
  }
}
function it(t) {
  const e = t[3] - t[0],
    n = t[4] - t[1],
    r = t[5] - t[2];
  return 2 * (e * n + n * r + r * e);
}
const st = 32,
  at = (t, e) => t.candidate - e.candidate,
  ct = new Array(st).fill().map(() => ({
    count: 0,
    bounds: new Float32Array(6),
    rightCacheBounds: new Float32Array(6),
    leftCacheBounds: new Float32Array(6),
    candidate: 0,
  })),
  ut = new Float32Array(6);
class lt {
  constructor() {
    this.boundingData = new Float32Array(6);
  }
}
function dt(t, e, n, r, o, i) {
  let s = r,
    a = r + o - 1;
  const c = i.pos,
    u = 2 * i.axis;
  for (;;) {
    for (; s <= a && n[6 * s + u] < c; ) s++;
    for (; s <= a && n[6 * a + u] >= c; ) a--;
    if (!(s < a)) return s;
    for (let t = 0; t < 3; t++) {
      let n = e[3 * s + t];
      (e[3 * s + t] = e[3 * a + t]), (e[3 * a + t] = n);
    }
    for (let t = 0; t < 6; t++) {
      let e = n[6 * s + t];
      (n[6 * s + t] = n[6 * a + t]), (n[6 * a + t] = e);
    }
    s++, a--;
  }
}
function ft(t, e, n, r, o, i) {
  let s = r,
    a = r + o - 1;
  const c = i.pos,
    u = 2 * i.axis;
  for (;;) {
    for (; s <= a && n[6 * s + u] < c; ) s++;
    for (; s <= a && n[6 * a + u] >= c; ) a--;
    if (!(s < a)) return s;
    {
      let e = t[s];
      (t[s] = t[a]), (t[a] = e);
      for (let t = 0; t < 6; t++) {
        let e = n[6 * s + t];
        (n[6 * s + t] = n[6 * a + t]), (n[6 * a + t] = e);
      }
      s++, a--;
    }
  }
}
function ht(t, e) {
  return 65535 === e[t + 15];
}
function pt(t, e) {
  return e[t + 6];
}
function yt(t, e) {
  return e[t + 14];
}
function mt(t) {
  return t + 8;
}
function xt(t, e) {
  return e[t + 6];
}
function gt(t, e) {
  return e[t + 7];
}
let bt, vt, wt, Bt;
const At = Math.pow(2, 32);
function Tt(t) {
  return "count" in t ? 1 : 1 + Tt(t.left) + Tt(t.right);
}
function Mt(t, e, n) {
  return (
    (bt = new Float32Array(n)),
    (vt = new Uint32Array(n)),
    (wt = new Uint16Array(n)),
    (Bt = new Uint8Array(n)),
    Pt(t, e)
  );
}
function Pt(t, e) {
  const n = t / 4,
    r = t / 2,
    o = "count" in e,
    i = e.boundingData;
  for (let t = 0; t < 6; t++) bt[n + t] = i[t];
  if (o) {
    if (e.buffer) {
      const r = e.buffer;
      Bt.set(new Uint8Array(r), t);
      for (let e = t, o = t + r.byteLength; e < o; e += G) {
        ht(e / 2, wt) || (vt[e / 4 + 6] += n);
      }
      return t + r.byteLength;
    }
    {
      const o = e.offset,
        i = e.count;
      return (vt[n + 6] = o), (wt[r + 14] = i), (wt[r + 15] = X), t + G;
    }
  }
  {
    const r = e.left,
      o = e.right,
      i = e.splitAxis;
    let s;
    if (((s = Pt(t + G, r)), s / 4 > At))
      throw new Error(
        "MeshBVH: Cannot store child pointer greater than 32 bits."
      );
    return (vt[n + 6] = s / 4), (s = Pt(s, o)), (vt[n + 7] = i), s;
  }
}
function It(t, e, n, r, o) {
  const {
      maxDepth: i,
      verbose: s,
      maxLeafTris: a,
      strategy: c,
      onProgress: u,
      indirect: l,
    } = o,
    d = t._indirectBuffer,
    f = t.geometry,
    h = f.index ? f.index.array : null,
    p = l ? ft : dt,
    y = j(f),
    m = new Float32Array(6);
  let x = !1;
  const g = new lt();
  return (
    Q(e, n, r, g.boundingData, m),
    (function t(n, r, o, u = null, l = 0) {
      !x &&
        l >= i &&
        ((x = !0),
        s &&
          (console.warn(
            `MeshBVH: Max depth of ${i} reached when generating BVH. Consider increasing maxDepth.`
          ),
          console.warn(f)));
      if (o <= a || l >= i) return b(r + o), (n.offset = r), (n.count = o), n;
      const y = (function (t, e, n, r, o, i) {
        let s = -1,
          a = 0;
        if (i === k) (s = et(e)), -1 !== s && (a = (e[s] + e[s + 3]) / 2);
        else if (i === C)
          (s = et(t)),
            -1 !== s &&
              (a = (function (t, e, n, r) {
                let o = 0;
                for (let i = e, s = e + n; i < s; i++) o += t[6 * i + 2 * r];
                return o / n;
              })(n, r, o, s));
        else if (i === H) {
          const i = it(t);
          let c = R * o;
          const u = 6 * r,
            l = 6 * (r + o);
          for (let t = 0; t < 3; t++) {
            const r = e[t],
              d = (e[t + 3] - r) / st;
            if (o < st / 4) {
              const e = [...ct];
              e.length = o;
              let r = 0;
              for (let o = u; o < l; o += 6, r++) {
                const i = e[r];
                (i.candidate = n[o + 2 * t]), (i.count = 0);
                const {
                  bounds: s,
                  leftCacheBounds: a,
                  rightCacheBounds: c,
                } = i;
                for (let t = 0; t < 3; t++)
                  (c[t] = 1 / 0),
                    (c[t + 3] = -1 / 0),
                    (a[t] = 1 / 0),
                    (a[t + 3] = -1 / 0),
                    (s[t] = 1 / 0),
                    (s[t + 3] = -1 / 0);
                ot(o, n, s);
              }
              e.sort(at);
              let d = o;
              for (let t = 0; t < d; t++) {
                const n = e[t];
                for (; t + 1 < d && e[t + 1].candidate === n.candidate; )
                  e.splice(t + 1, 1), d--;
              }
              for (let r = u; r < l; r += 6) {
                const o = n[r + 2 * t];
                for (let t = 0; t < d; t++) {
                  const i = e[t];
                  o >= i.candidate
                    ? ot(r, n, i.rightCacheBounds)
                    : (ot(r, n, i.leftCacheBounds), i.count++);
                }
              }
              for (let n = 0; n < d; n++) {
                const r = e[n],
                  u = r.count,
                  l = o - r.count,
                  d = r.leftCacheBounds,
                  f = r.rightCacheBounds;
                let h = 0;
                0 !== u && (h = it(d) / i);
                let p = 0;
                0 !== l && (p = it(f) / i);
                const y = W + R * (h * u + p * l);
                y < c && ((s = t), (c = y), (a = r.candidate));
              }
            } else {
              for (let t = 0; t < st; t++) {
                const e = ct[t];
                (e.count = 0), (e.candidate = r + d + t * d);
                const n = e.bounds;
                for (let t = 0; t < 3; t++) (n[t] = 1 / 0), (n[t + 3] = -1 / 0);
              }
              for (let e = u; e < l; e += 6) {
                let o = ~~((n[e + 2 * t] - r) / d);
                o >= st && (o = st - 1);
                const i = ct[o];
                i.count++, ot(e, n, i.bounds);
              }
              const e = ct[st - 1];
              nt(e.bounds, e.rightCacheBounds);
              for (let t = st - 2; t >= 0; t--) {
                const e = ct[t],
                  n = ct[t + 1];
                rt(e.bounds, n.rightCacheBounds, e.rightCacheBounds);
              }
              let f = 0;
              for (let e = 0; e < st - 1; e++) {
                const n = ct[e],
                  r = n.count,
                  u = n.bounds,
                  l = ct[e + 1].rightCacheBounds;
                0 !== r && (0 === f ? nt(u, ut) : rt(u, ut, ut)), (f += r);
                let d = 0,
                  h = 0;
                0 !== f && (d = it(ut) / i);
                const p = o - f;
                0 !== p && (h = it(l) / i);
                const y = W + R * (d * f + h * p);
                y < c && ((s = t), (c = y), (a = n.candidate));
              }
            }
          }
        } else console.warn(`MeshBVH: Invalid build strategy value ${i} used.`);
        return { axis: s, pos: a };
      })(n.boundingData, u, e, r, o, c);
      if (-1 === y.axis) return b(r + o), (n.offset = r), (n.count = o), n;
      const g = p(d, h, e, r, o, y);
      if (g === r || g === r + o) b(r + o), (n.offset = r), (n.count = o);
      else {
        n.splitAxis = y.axis;
        const i = new lt(),
          s = r,
          a = g - r;
        (n.left = i), Q(e, s, a, i.boundingData, m), t(i, s, a, m, l + 1);
        const c = new lt(),
          u = g,
          d = o - a;
        (n.right = c), Q(e, u, d, c.boundingData, m), t(c, u, d, m, l + 1);
      }
      return n;
    })(g, n, r, m),
    g
  );
  //   function b(t) {
  //     u && u(t / y);
  //   }
  function b1(t) {
    // rename the function to b1
    u && u(t / y);
  }
}
function _t(e, n) {
  const r = e.geometry;
  n.indirect &&
    ((e._indirectBuffer = (function (t, e) {
      const n = (t.index ? t.index.count : t.attributes.position.count) / 3,
        r = n > 65536,
        o = r ? 4 : 2,
        i = e ? new SharedArrayBuffer(n * o) : new ArrayBuffer(n * o),
        s = r ? new Uint32Array(i) : new Uint16Array(i);
      for (let t = 0, e = s.length; t < e; t++) s[t] = t;
      return s;
    })(r, n.useSharedArrayBuffer)),
    (function (t) {
      if (0 === t.groups.length) return !1;
      const e = j(t),
        n = J(t).sort((t, e) => t.offset - e.offset),
        r = n[n.length - 1];
      r.count = Math.min(e - r.offset, r.count);
      let o = 0;
      return n.forEach(({ count: t }) => (o += t)), e !== o;
    })(r) &&
      !n.verbose &&
      console.warn(
        'MeshBVH: Provided geometry contains groups that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.'
      )),
    e._indirectBuffer ||
      (function (e, n) {
        if (!e.index) {
          const r = e.attributes.position.count,
            o = K(r, n.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer);
          e.setIndex(new t(o, 1));
          for (let t = 0; t < r; t++) o[t] = t;
        }
      })(r, n);
  const o = n.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer,
    i = (function (t, e = null, n = null, r = null) {
      const o = t.attributes.position,
        i = t.index ? t.index.array : null,
        s = j(t),
        a = o.normalized;
      let c;
      null === e
        ? ((c = new Float32Array(6 * s * 4)), (n = 0), (r = s))
        : ((c = e), (n = n || 0), (r = r || s));
      const u = o.array,
        l = o.offset || 0;
      let d = 3;
      o.isInterleavedBufferAttribute && (d = o.data.stride);
      const f = ["getX", "getY", "getZ"];
      for (let t = n; t < n + r; t++) {
        const e = 3 * t,
          n = 6 * t;
        let r = e + 0,
          s = e + 1,
          h = e + 2;
        i && ((r = i[r]), (s = i[s]), (h = i[h])),
          a || ((r = r * d + l), (s = s * d + l), (h = h * d + l));
        for (let t = 0; t < 3; t++) {
          let e, i, l;
          a
            ? ((e = o[f[t]](r)), (i = o[f[t]](s)), (l = o[f[t]](h)))
            : ((e = u[r + t]), (i = u[s + t]), (l = u[h + t]));
          let d = e;
          i < d && (d = i), l < d && (d = l);
          let p = e;
          i > p && (p = i), l > p && (p = l);
          const y = (p - d) / 2,
            m = 2 * t;
          (c[n + m + 0] = d + y), (c[n + m + 1] = y + (Math.abs(d) + y) * L);
        }
      }
      return c;
    })(r),
    s = n.indirect ? $(r) : J(r);
  e._roots = s.map((t) => {
    const r = It(e, i, t.offset, t.count, n),
      s = Tt(r),
      a = new o(G * s);
    return Mt(0, r, a), a;
  });
}
class St {
  constructor() {
    (this.min = 1 / 0), (this.max = -1 / 0);
  }
  setFromPointsField(t, e) {
    let n = 1 / 0,
      r = -1 / 0;
    for (let o = 0, i = t.length; o < i; o++) {
      const i = t[o][e];
      (n = i < n ? i : n), (r = i > r ? i : r);
    }
    (this.min = n), (this.max = r);
  }
  setFromPoints(t, e) {
    let n = 1 / 0,
      r = -1 / 0;
    for (let o = 0, i = e.length; o < i; o++) {
      const i = e[o],
        s = t.dot(i);
      (n = s < n ? s : n), (r = s > r ? s : r);
    }
    (this.min = n), (this.max = r);
  }
  isSeparated(t) {
    return this.min > t.max || t.min > this.max;
  }
}
(St.prototype.setFromBox = (function () {
  const t = new e();
  return function (e, n) {
    const r = n.min,
      o = n.max;
    let i = 1 / 0,
      s = -1 / 0;
    for (let n = 0; n <= 1; n++)
      for (let a = 0; a <= 1; a++)
        for (let c = 0; c <= 1; c++) {
          (t.x = r.x * n + o.x * (1 - n)),
            (t.y = r.y * a + o.y * (1 - a)),
            (t.z = r.z * c + o.z * (1 - c));
          const u = e.dot(t);
          (i = Math.min(u, i)), (s = Math.max(u, s));
        }
    (this.min = i), (this.max = s);
  };
})()),
  (function () {
    const t = new St();
  })();
const Dt = (function () {
    const t = new e(),
      n = new e(),
      r = new e();
    return function (e, o, i) {
      const s = e.start,
        a = t,
        c = o.start,
        u = n;
      r.subVectors(s, c),
        t.subVectors(e.end, e.start),
        n.subVectors(o.end, o.start);
      const l = r.dot(u),
        d = u.dot(a),
        f = u.dot(u),
        h = r.dot(a),
        p = a.dot(a) * f - d * d;
      let y, m;
      (y = 0 !== p ? (l * d - h * f) / p : 0),
        (m = (l + y * d) / f),
        (i.x = y),
        (i.y = m);
    };
  })(),
  Ft = (function () {
    const t = new n(),
      r = new e(),
      o = new e();
    return function (e, n, i, s) {
      Dt(e, n, t);
      let a = t.x,
        c = t.y;
      if (a >= 0 && a <= 1 && c >= 0 && c <= 1)
        return e.at(a, i), void n.at(c, s);
      if (a >= 0 && a <= 1)
        return (
          c < 0 ? n.at(0, s) : n.at(1, s), void e.closestPointToPoint(s, !0, i)
        );
      if (c >= 0 && c <= 1)
        return (
          a < 0 ? e.at(0, i) : e.at(1, i), void n.closestPointToPoint(i, !0, s)
        );
      {
        let t, u;
        (t = a < 0 ? e.start : e.end), (u = c < 0 ? n.start : n.end);
        const l = r,
          d = o;
        return (
          e.closestPointToPoint(u, !0, r),
          n.closestPointToPoint(t, !0, o),
          l.distanceToSquared(u) <= d.distanceToSquared(t)
            ? (i.copy(l), void s.copy(u))
            : (i.copy(t), void s.copy(d))
        );
      }
    };
  })(),
  zt = (function () {
    const t = new e(),
      n = new e(),
      i = new r(),
      s = new o();
    return function (e, r) {
      const { radius: o, center: a } = e,
        { a: c, b: u, c: l } = r;
      (s.start = c), (s.end = u);
      if (s.closestPointToPoint(a, !0, t).distanceTo(a) <= o) return !0;
      (s.start = c), (s.end = l);
      if (s.closestPointToPoint(a, !0, t).distanceTo(a) <= o) return !0;
      (s.start = u), (s.end = l);
      if (s.closestPointToPoint(a, !0, t).distanceTo(a) <= o) return !0;
      const d = r.getPlane(i);
      if (Math.abs(d.distanceToPoint(a)) <= o) {
        const t = d.projectPoint(a, n);
        if (r.containsPoint(t)) return !0;
      }
      return !1;
    };
  })();
function Ut(t) {
  return Math.abs(t) < 1e-15;
}
class Et extends i {
  constructor(...t) {
    super(...t),
      (this.isExtendedTriangle = !0),
      (this.satAxes = new Array(4).fill().map(() => new e())),
      (this.satBounds = new Array(4).fill().map(() => new St())),
      (this.points = [this.a, this.b, this.c]),
      (this.sphere = new s()),
      (this.plane = new r()),
      (this.needsUpdate = !0);
  }
  intersectsSphere(t) {
    return zt(t, this);
  }
  update() {
    const t = this.a,
      e = this.b,
      n = this.c,
      r = this.points,
      o = this.satAxes,
      i = this.satBounds,
      s = o[0],
      a = i[0];
    this.getNormal(s), a.setFromPoints(s, r);
    const c = o[1],
      u = i[1];
    c.subVectors(t, e), u.setFromPoints(c, r);
    const l = o[2],
      d = i[2];
    l.subVectors(e, n), d.setFromPoints(l, r);
    const f = o[3],
      h = i[3];
    f.subVectors(n, t),
      h.setFromPoints(f, r),
      this.sphere.setFromPoints(this.points),
      this.plane.setFromNormalAndCoplanarPoint(s, t),
      (this.needsUpdate = !1);
  }
}
(Et.prototype.closestPointToSegment = (function () {
  const t = new e(),
    n = new e(),
    r = new o();
  return function (e, o = null, i = null) {
    const { start: s, end: a } = e,
      c = this.points;
    let u,
      l = 1 / 0;
    for (let s = 0; s < 3; s++) {
      const a = (s + 1) % 3;
      r.start.copy(c[s]),
        r.end.copy(c[a]),
        Ft(r, e, t, n),
        (u = t.distanceToSquared(n)),
        u < l && ((l = u), o && o.copy(t), i && i.copy(n));
    }
    return (
      this.closestPointToPoint(s, t),
      (u = s.distanceToSquared(t)),
      u < l && ((l = u), o && o.copy(t), i && i.copy(s)),
      this.closestPointToPoint(a, t),
      (u = a.distanceToSquared(t)),
      u < l && ((l = u), o && o.copy(t), i && i.copy(a)),
      Math.sqrt(l)
    );
  };
})()),
  (Et.prototype.intersectsTriangle = (function () {
    const t = new Et(),
      n = new Array(3),
      r = new Array(3),
      i = new St(),
      s = new St(),
      a = new e(),
      c = new e(),
      u = new e(),
      l = new e(),
      d = new e(),
      f = new o(),
      h = new o(),
      p = new o(),
      y = new e();
    function m(t, e, n) {
      const r = t.points;
      let o = 0,
        i = -1;
      for (let t = 0; t < 3; t++) {
        const { start: s, end: a } = f;
        s.copy(r[t]), a.copy(r[(t + 1) % 3]), f.delta(c);
        const u = Ut(e.distanceToPoint(s));
        if (Ut(e.normal.dot(c)) && u) {
          n.copy(f), (o = 2);
          break;
        }
        const l = e.intersectLine(f, y);
        if ((!l && u && y.copy(s), (l || u) && !Ut(y.distanceTo(a)))) {
          if (o <= 1) {
            (1 === o ? n.start : n.end).copy(y), u && (i = o);
          } else if (o >= 2) {
            (1 === i ? n.start : n.end).copy(y), (o = 2);
            break;
          }
          if ((o++, 2 === o && -1 === i)) break;
        }
      }
      return o;
    }
    return function (e, o = null, c = !1) {
      this.needsUpdate && this.update(),
        e.isExtendedTriangle
          ? e.needsUpdate && e.update()
          : (t.copy(e), t.update(), (e = t));
      const f = this.plane,
        y = e.plane;
      if (Math.abs(f.normal.dot(y.normal)) > 1 - 1e-10) {
        const t = this.satBounds,
          u = this.satAxes;
        (r[0] = e.a), (r[1] = e.b), (r[2] = e.c);
        for (let e = 0; e < 4; e++) {
          const n = t[e],
            o = u[e];
          if ((i.setFromPoints(o, r), n.isSeparated(i))) return !1;
        }
        const l = e.satBounds,
          d = e.satAxes;
        (n[0] = this.a), (n[1] = this.b), (n[2] = this.c);
        for (let t = 0; t < 4; t++) {
          const e = l[t],
            r = d[t];
          if ((i.setFromPoints(r, n), e.isSeparated(i))) return !1;
        }
        for (let t = 0; t < 4; t++) {
          const e = u[t];
          for (let t = 0; t < 4; t++) {
            const o = d[t];
            if (
              (a.crossVectors(e, o),
              i.setFromPoints(a, n),
              s.setFromPoints(a, r),
              i.isSeparated(s))
            )
              return !1;
          }
        }
        return (
          o &&
            (c ||
              console.warn(
                "ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."
              ),
            o.start.set(0, 0, 0),
            o.end.set(0, 0, 0)),
          !0
        );
      }
      {
        const t = m(this, y, h);
        if (1 === t && e.containsPoint(h.end))
          return o && (o.start.copy(h.end), o.end.copy(h.end)), !0;
        if (2 !== t) return !1;
        const n = m(e, f, p);
        if (1 === n && this.containsPoint(p.end))
          return o && (o.start.copy(p.end), o.end.copy(p.end)), !0;
        if (2 !== n) return !1;
        if ((h.delta(u), p.delta(l), u.dot(l) < 0)) {
          let t = p.start;
          (p.start = p.end), (p.end = t);
        }
        const r = h.start.dot(u),
          i = h.end.dot(u),
          s = p.start.dot(u),
          a = p.end.dot(u);
        return (
          (r === a || s === i || i < s !== r < a) &&
          (o &&
            (d.subVectors(h.start, p.start),
            d.dot(u) > 0 ? o.start.copy(h.start) : o.start.copy(p.start),
            d.subVectors(h.end, p.end),
            d.dot(u) < 0 ? o.end.copy(h.end) : o.end.copy(p.end)),
          !0)
        );
      }
    };
  })()),
  (Et.prototype.distanceToPoint = (function () {
    const t = new e();
    return function (e) {
      return this.closestPointToPoint(e, t), e.distanceTo(t);
    };
  })()),
  (Et.prototype.distanceToTriangle = (function () {
    const t = new e(),
      n = new e(),
      r = ["a", "b", "c"],
      i = new o(),
      s = new o();
    return function (e, o = null, a = null) {
      const c = o || a ? i : null;
      if (this.intersectsTriangle(e, c))
        return (o || a) && (o && c.getCenter(o), a && c.getCenter(a)), 0;
      let u = 1 / 0;
      for (let n = 0; n < 3; n++) {
        let i;
        const s = r[n],
          c = e[s];
        this.closestPointToPoint(c, t),
          (i = c.distanceToSquared(t)),
          i < u && ((u = i), o && o.copy(t), a && a.copy(c));
        const l = this[s];
        e.closestPointToPoint(l, t),
          (i = l.distanceToSquared(t)),
          i < u && ((u = i), o && o.copy(l), a && a.copy(t));
      }
      for (let c = 0; c < 3; c++) {
        const l = r[c],
          d = r[(c + 1) % 3];
        i.set(this[l], this[d]);
        for (let c = 0; c < 3; c++) {
          const l = r[c],
            d = r[(c + 1) % 3];
          s.set(e[l], e[d]), Ft(i, s, t, n);
          const f = t.distanceToSquared(n);
          f < u && ((u = f), o && o.copy(t), a && a.copy(n));
        }
      }
      return Math.sqrt(u);
    };
  })());
class Nt {
  constructor(t, n, r) {
    (this.isOrientedBox = !0),
      (this.min = new e()),
      (this.max = new e()),
      (this.matrix = new a()),
      (this.invMatrix = new a()),
      (this.points = new Array(8).fill().map(() => new e())),
      (this.satAxes = new Array(3).fill().map(() => new e())),
      (this.satBounds = new Array(3).fill().map(() => new St())),
      (this.alignedSatBounds = new Array(3).fill().map(() => new St())),
      (this.needsUpdate = !1),
      t && this.min.copy(t),
      n && this.max.copy(n),
      r && this.matrix.copy(r);
  }
  set(t, e, n) {
    this.min.copy(t),
      this.max.copy(e),
      this.matrix.copy(n),
      (this.needsUpdate = !0);
  }
  copy(t) {
    this.min.copy(t.min),
      this.max.copy(t.max),
      this.matrix.copy(t.matrix),
      (this.needsUpdate = !0);
  }
}
(Nt.prototype.update = function () {
  const t = this.matrix,
    e = this.min,
    n = this.max,
    r = this.points;
  for (let o = 0; o <= 1; o++)
    for (let i = 0; i <= 1; i++)
      for (let s = 0; s <= 1; s++) {
        const a = r[(1 * o) | (2 * i) | (4 * s)];
        (a.x = o ? n.x : e.x),
          (a.y = i ? n.y : e.y),
          (a.z = s ? n.z : e.z),
          a.applyMatrix4(t);
      }
  const o = this.satBounds,
    i = this.satAxes,
    s = r[0];
  for (let t = 0; t < 3; t++) {
    const e = i[t],
      n = o[t],
      a = r[1 << t];
    e.subVectors(s, a), n.setFromPoints(e, r);
  }
  const a = this.alignedSatBounds;
  a[0].setFromPointsField(r, "x"),
    a[1].setFromPointsField(r, "y"),
    a[2].setFromPointsField(r, "z"),
    this.invMatrix.copy(this.matrix).invert(),
    (this.needsUpdate = !1);
}),
  (Nt.prototype.intersectsBox = (function () {
    const t = new St();
    return function (e) {
      this.needsUpdate && this.update();
      const n = e.min,
        r = e.max,
        o = this.satBounds,
        i = this.satAxes,
        s = this.alignedSatBounds;
      if (((t.min = n.x), (t.max = r.x), s[0].isSeparated(t))) return !1;
      if (((t.min = n.y), (t.max = r.y), s[1].isSeparated(t))) return !1;
      if (((t.min = n.z), (t.max = r.z), s[2].isSeparated(t))) return !1;
      for (let n = 0; n < 3; n++) {
        const r = i[n],
          s = o[n];
        if ((t.setFromBox(r, e), s.isSeparated(t))) return !1;
      }
      return !0;
    };
  })()),
  (Nt.prototype.intersectsTriangle = (function () {
    const t = new Et(),
      n = new Array(3),
      r = new St(),
      o = new St(),
      i = new e();
    return function (e) {
      this.needsUpdate && this.update(),
        e.isExtendedTriangle
          ? e.needsUpdate && e.update()
          : (t.copy(e), t.update(), (e = t));
      const s = this.satBounds,
        a = this.satAxes;
      (n[0] = e.a), (n[1] = e.b), (n[2] = e.c);
      for (let t = 0; t < 3; t++) {
        const e = s[t],
          o = a[t];
        if ((r.setFromPoints(o, n), e.isSeparated(r))) return !1;
      }
      const c = e.satBounds,
        u = e.satAxes,
        l = this.points;
      for (let t = 0; t < 3; t++) {
        const e = c[t],
          n = u[t];
        if ((r.setFromPoints(n, l), e.isSeparated(r))) return !1;
      }
      for (let t = 0; t < 3; t++) {
        const e = a[t];
        for (let t = 0; t < 4; t++) {
          const s = u[t];
          if (
            (i.crossVectors(e, s),
            r.setFromPoints(i, n),
            o.setFromPoints(i, l),
            r.isSeparated(o))
          )
            return !1;
        }
      }
      return !0;
    };
  })()),
  (Nt.prototype.closestPointToPoint = function (t, e) {
    return (
      this.needsUpdate && this.update(),
      e
        .copy(t)
        .applyMatrix4(this.invMatrix)
        .clamp(this.min, this.max)
        .applyMatrix4(this.matrix),
      e
    );
  }),
  (Nt.prototype.distanceToPoint = (function () {
    const t = new e();
    return function (e) {
      return this.closestPointToPoint(e, t), e.distanceTo(t);
    };
  })()),
  (Nt.prototype.distanceToBox = (function () {
    const t = ["x", "y", "z"],
      n = new Array(12).fill().map(() => new o()),
      r = new Array(12).fill().map(() => new o()),
      i = new e(),
      s = new e();
    return function (e, o = 0, a = null, c = null) {
      if ((this.needsUpdate && this.update(), this.intersectsBox(e)))
        return (
          (a || c) &&
            (e.getCenter(s),
            this.closestPointToPoint(s, i),
            e.closestPointToPoint(i, s),
            a && a.copy(i),
            c && c.copy(s)),
          0
        );
      const u = o * o,
        l = e.min,
        d = e.max,
        f = this.points;
      let h = 1 / 0;
      for (let t = 0; t < 8; t++) {
        const e = f[t];
        s.copy(e).clamp(l, d);
        const n = e.distanceToSquared(s);
        if (n < h && ((h = n), a && a.copy(e), c && c.copy(s), n < u))
          return Math.sqrt(n);
      }
      let p = 0;
      for (let e = 0; e < 3; e++)
        for (let o = 0; o <= 1; o++)
          for (let i = 0; i <= 1; i++) {
            const s = (e + 1) % 3,
              a = (e + 2) % 3,
              c = (1 << e) | (o << s) | (i << a),
              u = f[(o << s) | (i << a)],
              h = f[c];
            n[p].set(u, h);
            const y = t[e],
              m = t[s],
              x = t[a],
              g = r[p],
              b = g.start,
              v = g.end;
            (b[y] = l[y]),
              (b[m] = o ? l[m] : d[m]),
              (b[x] = i ? l[x] : d[m]),
              (v[y] = d[y]),
              (v[m] = o ? l[m] : d[m]),
              (v[x] = i ? l[x] : d[m]),
              p++;
          }
      for (let t = 0; t <= 1; t++)
        for (let e = 0; e <= 1; e++)
          for (let n = 0; n <= 1; n++) {
            (s.x = t ? d.x : l.x),
              (s.y = e ? d.y : l.y),
              (s.z = n ? d.z : l.z),
              this.closestPointToPoint(s, i);
            const r = s.distanceToSquared(i);
            if (r < h && ((h = r), a && a.copy(i), c && c.copy(s), r < u))
              return Math.sqrt(r);
          }
      for (let t = 0; t < 12; t++) {
        const e = n[t];
        for (let t = 0; t < 12; t++) {
          const n = r[t];
          Ft(e, n, i, s);
          const o = i.distanceToSquared(s);
          if (o < h && ((h = o), a && a.copy(i), c && c.copy(s), o < u))
            return Math.sqrt(o);
        }
      }
      return Math.sqrt(h);
    };
  })());
class kt {
  constructor(t) {
    (this._getNewPrimitive = t), (this._primitives = []);
  }
  getPrimitive() {
    const t = this._primitives;
    return 0 === t.length ? this._getNewPrimitive() : t.pop();
  }
  releasePrimitive(t) {
    this._primitives.push(t);
  }
}
class Ct extends kt {
  constructor() {
    super(() => new Et());
  }
}
const Ht = new Ct();
const qt = new (class {
  constructor() {
    (this.float32Array = null),
      (this.uint16Array = null),
      (this.uint32Array = null);
    const t = [];
    let e = null;
    (this.setBuffer = (n) => {
      e && t.push(e),
        (e = n),
        (this.float32Array = new Float32Array(n)),
        (this.uint16Array = new Uint16Array(n)),
        (this.uint32Array = new Uint32Array(n));
    }),
      (this.clearBuffer = () => {
        (e = null),
          (this.float32Array = null),
          (this.uint16Array = null),
          (this.uint32Array = null),
          0 !== t.length && this.setBuffer(t.pop());
      });
  }
})();
let Vt, Ot;
const Rt = [],
  Wt = new kt(() => new c());
function Gt(t, e, n, r, o, i) {
  (Vt = Wt.getPrimitive()),
    (Ot = Wt.getPrimitive()),
    Rt.push(Vt, Ot),
    qt.setBuffer(t._roots[e]);
  const s = Xt(0, t.geometry, n, r, o, i);
  qt.clearBuffer(),
    Wt.releasePrimitive(Vt),
    Wt.releasePrimitive(Ot),
    Rt.pop(),
    Rt.pop();
  const a = Rt.length;
  return a > 0 && ((Ot = Rt[a - 1]), (Vt = Rt[a - 2])), s;
}
function Xt(t, e, n, r, o = null, i = 0, s = 0) {
  const { float32Array: a, uint16Array: c, uint32Array: u } = qt;
  let l = 2 * t;
  if (ht(l, c)) {
    const h = pt(t, u),
      p = yt(l, c);
    return tt(t, a, Vt), r(h, p, !1, s, i + t, Vt);
  }
  {
    const y = mt(t),
      m = xt(t, u);
    let x,
      g,
      b,
      v,
      w = y,
      B = m;
    if (
      o &&
      ((b = Vt),
      (v = Ot),
      tt(w, a, b),
      tt(B, a, v),
      (x = o(b)),
      (g = o(v)),
      g < x)
    ) {
      (w = m), (B = y);
      const I = x;
      (x = g), (g = I), (b = v);
    }
    b || ((b = Vt), tt(w, a, b));
    const A = n(b, ht(2 * w, c), x, s + 1, i + w);
    let T;
    if (A === O) {
      const _ = d(w);
      T = r(_, f(w) - _, !0, s + 1, i + w, b);
    } else T = A && Xt(w, e, n, r, o, i, s + 1);
    if (T) return !0;
    (v = Ot), tt(B, a, v);
    const M = n(v, ht(2 * B, c), g, s + 1, i + B);
    let P;
    if (M === O) {
      const S = d(B);
      P = r(S, f(B) - S, !0, s + 1, i + B, v);
    } else P = M && Xt(B, e, n, r, o, i, s + 1);
    return !!P;
    function d(t) {
      const { uint16Array: e, uint32Array: n } = qt;
      let r = 2 * t;
      for (; !ht(r, e); ) r = 2 * (t = mt(t));
      return pt(t, n);
    }
    function f(t) {
      const { uint16Array: e, uint32Array: n } = qt;
      let r = 2 * t;
      for (; !ht(r, e); ) r = 2 * (t = xt(t, n));
      return pt(t, n) + yt(r, e);
    }
  }
}
const Lt = new e(),
  Yt = new e();
const Zt = new e(),
  jt = new e(),
  Kt = new e(),
  $t = new n(),
  Jt = new n(),
  Qt = new n(),
  te = new e(),
  ee = new e(),
  ne = new e(),
  re = new e();
function oe(t, r, o, s, a, c, d, f, h) {
  Zt.fromBufferAttribute(r, c),
    jt.fromBufferAttribute(r, d),
    Kt.fromBufferAttribute(r, f);
  const p = (function (t, e, n, r, o, i) {
    let s;
    return (
      (s =
        i === u
          ? t.intersectTriangle(r, n, e, !0, o)
          : t.intersectTriangle(e, n, r, i !== l, o)),
      null === s ? null : { distance: t.origin.distanceTo(o), point: o.clone() }
    );
  })(t, Zt, jt, Kt, re, h);
  if (p) {
    s &&
      ($t.fromBufferAttribute(s, c),
      Jt.fromBufferAttribute(s, d),
      Qt.fromBufferAttribute(s, f),
      (p.uv = i.getInterpolation(re, Zt, jt, Kt, $t, Jt, Qt, new n()))),
      a &&
        ($t.fromBufferAttribute(a, c),
        Jt.fromBufferAttribute(a, d),
        Qt.fromBufferAttribute(a, f),
        (p.uv1 = i.getInterpolation(re, Zt, jt, Kt, $t, Jt, Qt, new n()))),
      o &&
        (te.fromBufferAttribute(o, c),
        ee.fromBufferAttribute(o, d),
        ne.fromBufferAttribute(o, f),
        (p.normal = i.getInterpolation(re, Zt, jt, Kt, te, ee, ne, new e())),
        p.normal.dot(t.direction) > 0 && p.normal.multiplyScalar(-1));
    const r = { a: c, b: d, c: f, normal: new e(), materialIndex: 0 };
    i.getNormal(Zt, jt, Kt, r.normal), (p.face = r), (p.faceIndex = c);
  }
  return p;
}
function ie(t, e, n, r, o) {
  const i = 3 * r;
  let s = i + 0,
    a = i + 1,
    c = i + 2;
  const u = t.index;
  t.index && ((s = u.getX(s)), (a = u.getX(a)), (c = u.getX(c)));
  const { position: l, normal: d, uv: f, uv1: h } = t.attributes,
    p = oe(n, l, d, f, h, s, a, c, e);
  return p ? ((p.faceIndex = r), o && o.push(p), p) : null;
}
function se(t, e, n, r) {
  const o = t.a,
    i = t.b,
    s = t.c;
  let a = e,
    c = e + 1,
    u = e + 2;
  n && ((a = n.getX(a)), (c = n.getX(c)), (u = n.getX(u))),
    (o.x = r.getX(a)),
    (o.y = r.getY(a)),
    (o.z = r.getZ(a)),
    (i.x = r.getX(c)),
    (i.y = r.getY(c)),
    (i.z = r.getZ(c)),
    (s.x = r.getX(u)),
    (s.y = r.getY(u)),
    (s.z = r.getZ(u));
}
const ae = new e(),
  ce = new e(),
  ue = new e(),
  le = new n(),
  de = new n(),
  fe = new n();
function he(t, r, o, s) {
  const a = r.getIndex().array,
    c = r.getAttribute("position"),
    u = r.getAttribute("uv"),
    l = a[3 * o],
    d = a[3 * o + 1],
    f = a[3 * o + 2];
  ae.fromBufferAttribute(c, l),
    ce.fromBufferAttribute(c, d),
    ue.fromBufferAttribute(c, f);
  let h = 0;
  const p = r.groups,
    y = 3 * o;
  for (let t = 0, e = p.length; t < e; t++) {
    const e = p[t],
      { start: n, count: r } = e;
    if (y >= n && y < n + r) {
      h = e.materialIndex;
      break;
    }
  }
  let m = null;
  return (
    u &&
      (le.fromBufferAttribute(u, l),
      de.fromBufferAttribute(u, d),
      fe.fromBufferAttribute(u, f),
      (m = s && s.uv ? s.uv : new n()),
      i.getInterpolation(t, ae, ce, ue, le, de, fe, m)),
    s
      ? (s.face || (s.face = {}),
        (s.face.a = l),
        (s.face.b = d),
        (s.face.c = f),
        (s.face.materialIndex = h),
        s.face.normal || (s.face.normal = new e()),
        i.getNormal(ae, ce, ue, s.face.normal),
        m && (s.uv = m),
        s)
      : {
          face: {
            a: l,
            b: d,
            c: f,
            materialIndex: h,
            normal: i.getNormal(ae, ce, ue, new e()),
          },
          uv: m,
        }
  );
}
function pe(t, e, n, r, o, i, s) {
  const { geometry: a } = n,
    { index: c } = a,
    u = a.attributes.position;
  for (let n = t, a = e + t; n < a; n++) {
    let t;
    if (((t = n), se(s, 3 * t, c, u), (s.needsUpdate = !0), r(s, t, o, i)))
      return !0;
  }
  return !1;
}
function ye(t, e = null) {
  e && Array.isArray(e) && (e = new Set(e));
  const n = t.geometry,
    r = n.index ? n.index.array : null,
    o = n.attributes.position;
  let i,
    s,
    a,
    c,
    u = 0;
  const l = t._roots;
  for (let t = 0, e = l.length; t < e; t++)
    (i = l[t]),
      (s = new Uint32Array(i)),
      (a = new Uint16Array(i)),
      (c = new Float32Array(i)),
      d(0, u),
      (u += i.byteLength);
  function d(t, n, i = !1) {
    const u = 2 * t;
    if (a[u + 15] === X) {
      const e = s[t + 6];
      let n = 1 / 0,
        i = 1 / 0,
        l = 1 / 0,
        d = -1 / 0,
        f = -1 / 0,
        h = -1 / 0;
      for (let t = 3 * e, s = 3 * (e + a[u + 14]); t < s; t++) {
        let e = r[t];
        const s = o.getX(e),
          a = o.getY(e),
          c = o.getZ(e);
        s < n && (n = s),
          s > d && (d = s),
          a < i && (i = a),
          a > f && (f = a),
          c < l && (l = c),
          c > h && (h = c);
      }
      return (
        (c[t + 0] !== n ||
          c[t + 1] !== i ||
          c[t + 2] !== l ||
          c[t + 3] !== d ||
          c[t + 4] !== f ||
          c[t + 5] !== h) &&
        ((c[t + 0] = n),
        (c[t + 1] = i),
        (c[t + 2] = l),
        (c[t + 3] = d),
        (c[t + 4] = f),
        (c[t + 5] = h),
        !0)
      );
    }
    {
      const r = t + 8,
        o = s[t + 6],
        a = r + n,
        u = o + n;
      let l = i,
        f = !1,
        h = !1;
      e
        ? l || ((f = e.has(a)), (h = e.has(u)), (l = !f && !h))
        : ((f = !0), (h = !0));
      const p = l || h;
      let y = !1;
      (l || f) && (y = d(r, n, l));
      let m = !1;
      p && (m = d(o, n, l));
      const x = y || m;
      if (x)
        for (let e = 0; e < 3; e++) {
          const n = r + e,
            i = o + e,
            s = c[n],
            a = c[n + 3],
            u = c[i],
            l = c[i + 3];
          (c[t + e] = s < u ? s : u), (c[t + e + 3] = a > l ? a : l);
        }
      return x;
    }
  }
}
function me(t, e, n) {
  let r, o, i, s, a, c;
  const u = 1 / n.direction.x,
    l = 1 / n.direction.y,
    d = 1 / n.direction.z,
    f = n.origin.x,
    h = n.origin.y,
    p = n.origin.z;
  let y = e[t],
    m = e[t + 3],
    x = e[t + 1],
    g = e[t + 3 + 1],
    b = e[t + 2],
    v = e[t + 3 + 2];
  return (
    u >= 0
      ? ((r = (y - f) * u), (o = (m - f) * u))
      : ((r = (m - f) * u), (o = (y - f) * u)),
    l >= 0
      ? ((i = (x - h) * l), (s = (g - h) * l))
      : ((i = (g - h) * l), (s = (x - h) * l)),
    !(r > s || i > o) &&
      ((i > r || isNaN(r)) && (r = i),
      (s < o || isNaN(o)) && (o = s),
      d >= 0
        ? ((a = (b - p) * d), (c = (v - p) * d))
        : ((a = (v - p) * d), (c = (b - p) * d)),
      !(r > c || a > o) && ((c < o || o != o) && (o = c), !(o < 0)))
  );
}
function xe(t, e, n, r, o, i, s) {
  const { geometry: a } = n,
    { index: c } = a,
    u = a.attributes.position;
  for (let a = t, l = e + t; a < l; a++) {
    let t;
    if (
      ((t = n.resolveTriangleIndex(a)),
      se(s, 3 * t, c, u),
      (s.needsUpdate = !0),
      r(s, t, o, i))
    )
      return !0;
  }
  return !1;
}
function ge(t, e, n, r, o) {
  qt.setBuffer(t._roots[e]), be(0, t, n, r, o), qt.clearBuffer();
}
function be(t, e, n, r, o) {
  const { float32Array: i, uint16Array: s, uint32Array: a } = qt,
    c = 2 * t;
  if (ht(c, s)) {
    !(function (t, e, n, r, o, i) {
      const { geometry: s, _indirectBuffer: a } = t;
      for (let t = r, a = r + o; t < a; t++) ie(s, e, n, t, i);
    })(e, n, r, pt(t, a), yt(c, s), o);
  } else {
    const s = mt(t);
    me(s, i, r) && be(s, e, n, r, o);
    const c = xt(t, a);
    me(c, i, r) && be(c, e, n, r, o);
  }
}
const ve = ["x", "y", "z"];
function we(t, e, n, r) {
  qt.setBuffer(t._roots[e]);
  const o = Be(0, t, n, r);
  return qt.clearBuffer(), o;
}
function Be(t, e, n, r) {
  const { float32Array: o, uint16Array: i, uint32Array: s } = qt;
  let a = 2 * t;
  if (ht(a, i)) {
    return (function (t, e, n, r, o) {
      const { geometry: i, _indirectBuffer: s } = t;
      let a = 1 / 0,
        c = null;
      for (let t = r, s = r + o; t < s; t++) {
        let r;
        (r = ie(i, e, n, t)),
          r && r.distance < a && ((c = r), (a = r.distance));
      }
      return c;
    })(e, n, r, pt(t, s), yt(a, i));
  }
  {
    const i = gt(t, s),
      a = ve[i],
      c = r.direction[a] >= 0;
    let u, l;
    c ? ((u = mt(t)), (l = xt(t, s))) : ((u = xt(t, s)), (l = mt(t)));
    const d = me(u, o, r) ? Be(u, e, n, r) : null;
    if (d) {
      const t = d.point[a];
      if (c ? t <= o[l + i] : t >= o[l + i + 3]) return d;
    }
    const f = me(l, o, r) ? Be(l, e, n, r) : null;
    return d && f ? (d.distance <= f.distance ? d : f) : d || f || null;
  }
}
const Ae = new c(),
  Te = new Et(),
  Me = new Et(),
  Pe = new a(),
  Ie = new Nt(),
  _e = new Nt();
function Se(t, e, n, r) {
  qt.setBuffer(t._roots[e]);
  const o = De(0, t, n, r);
  return qt.clearBuffer(), o;
}
function De(t, e, n, r, o = null) {
  const { float32Array: i, uint16Array: s, uint32Array: a } = qt;
  let c = 2 * t;
  null === o &&
    (n.boundingBox || n.computeBoundingBox(),
    Ie.set(n.boundingBox.min, n.boundingBox.max, r),
    (o = Ie));
  if (!ht(c, s)) {
    const s = t + 8,
      c = a[t + 6];
    tt(s, i, Ae);
    if (o.intersectsBox(Ae) && De(s, e, n, r, o)) return !0;
    tt(c, i, Ae);
    return !!(o.intersectsBox(Ae) && De(c, e, n, r, o));
  }
  {
    const o = e.geometry,
      u = o.index,
      l = o.attributes.position,
      d = n.index,
      f = n.attributes.position,
      h = pt(t, a),
      p = yt(c, s);
    if ((Pe.copy(r).invert(), n.boundsTree)) {
      tt(t, i, _e), _e.matrix.copy(Pe), (_e.needsUpdate = !0);
      return n.boundsTree.shapecast({
        intersectsBounds: (t) => _e.intersectsBox(t),
        intersectsTriangle: (t) => {
          t.a.applyMatrix4(r),
            t.b.applyMatrix4(r),
            t.c.applyMatrix4(r),
            (t.needsUpdate = !0);
          for (let e = 3 * h, n = 3 * (p + h); e < n; e += 3)
            if (
              (se(Me, e, u, l), (Me.needsUpdate = !0), t.intersectsTriangle(Me))
            )
              return !0;
          return !1;
        },
      });
    }
    for (let t = 3 * h, e = 3 * (p + h); t < e; t += 3) {
      se(Te, t, u, l),
        Te.a.applyMatrix4(Pe),
        Te.b.applyMatrix4(Pe),
        Te.c.applyMatrix4(Pe),
        (Te.needsUpdate = !0);
      for (let t = 0, e = d.count; t < e; t += 3)
        if ((se(Me, t, d, f), (Me.needsUpdate = !0), Te.intersectsTriangle(Me)))
          return !0;
    }
  }
}
const Fe = new a(),
  ze = new Nt(),
  Ue = new Nt(),
  Ee = new e(),
  Ne = new e(),
  ke = new e(),
  Ce = new e();
function He(t, e, n, r = {}, o = {}, i = 0, s = 1 / 0) {
  e.boundingBox || e.computeBoundingBox(),
    ze.set(e.boundingBox.min, e.boundingBox.max, n),
    (ze.needsUpdate = !0);
  const a = t.geometry,
    c = a.attributes.position,
    u = a.index,
    l = e.attributes.position,
    d = e.index,
    f = Ht.getPrimitive(),
    h = Ht.getPrimitive();
  let p = Ee,
    y = Ne,
    m = null,
    x = null;
  o && ((m = ke), (x = Ce));
  let g = 1 / 0,
    b = null,
    v = null;
  return (
    Fe.copy(n).invert(),
    Ue.matrix.copy(Fe),
    t.shapecast({
      boundsTraverseOrder: (t) => ze.distanceToBox(t),
      intersectsBounds: (t, e, n) =>
        n < g &&
        n < s &&
        (e && (Ue.min.copy(t.min), Ue.max.copy(t.max), (Ue.needsUpdate = !0)),
        !0),
      intersectsRange: (t, r) => {
        if (e.boundsTree) {
          return e.boundsTree.shapecast({
            boundsTraverseOrder: (t) => Ue.distanceToBox(t),
            intersectsBounds: (t, e, n) => n < g && n < s,
            intersectsRange: (e, o) => {
              for (let s = e, a = e + o; s < a; s++) {
                se(h, 3 * s, d, l),
                  h.a.applyMatrix4(n),
                  h.b.applyMatrix4(n),
                  h.c.applyMatrix4(n),
                  (h.needsUpdate = !0);
                for (let e = t, n = t + r; e < n; e++) {
                  se(f, 3 * e, u, c), (f.needsUpdate = !0);
                  const t = f.distanceToTriangle(h, p, m);
                  if (
                    (t < g &&
                      (y.copy(p), x && x.copy(m), (g = t), (b = e), (v = s)),
                    t < i)
                  )
                    return !0;
                }
              }
            },
          });
        }
        for (let o = 0, s = j(e); o < s; o++) {
          se(h, 3 * o, d, l),
            h.a.applyMatrix4(n),
            h.b.applyMatrix4(n),
            h.c.applyMatrix4(n),
            (h.needsUpdate = !0);
          for (let e = t, n = t + r; e < n; e++) {
            se(f, 3 * e, u, c), (f.needsUpdate = !0);
            const t = f.distanceToTriangle(h, p, m);
            if (
              (t < g && (y.copy(p), x && x.copy(m), (g = t), (b = e), (v = o)),
              t < i)
            )
              return !0;
          }
        }
      },
    }),
    Ht.releasePrimitive(f),
    Ht.releasePrimitive(h),
    g === 1 / 0
      ? null
      : (r.point ? r.point.copy(y) : (r.point = y.clone()),
        (r.distance = g),
        (r.faceIndex = b),
        o &&
          (o.point ? o.point.copy(x) : (o.point = x.clone()),
          o.point.applyMatrix4(Fe),
          y.applyMatrix4(Fe),
          (o.distance = y.sub(o.point).length()),
          (o.faceIndex = v)),
        r)
  );
}
function qe(t, e = null) {
  e && Array.isArray(e) && (e = new Set(e));
  const n = t.geometry,
    r = n.index ? n.index.array : null,
    o = n.attributes.position;
  let i,
    s,
    a,
    c,
    u = 0;
  const l = t._roots;
  for (let t = 0, e = l.length; t < e; t++)
    (i = l[t]),
      (s = new Uint32Array(i)),
      (a = new Uint16Array(i)),
      (c = new Float32Array(i)),
      d(0, u),
      (u += i.byteLength);
  function d(n, i, u = !1) {
    const l = 2 * n;
    if (a[l + 15] === X) {
      const e = s[n + 6];
      let i = 1 / 0,
        u = 1 / 0,
        d = 1 / 0,
        f = -1 / 0,
        h = -1 / 0,
        p = -1 / 0;
      for (let n = e, s = e + a[l + 14]; n < s; n++) {
        const e = 3 * t.resolveTriangleIndex(n);
        for (let t = 0; t < 3; t++) {
          let n = e + t;
          n = r ? r[n] : n;
          const s = o.getX(n),
            a = o.getY(n),
            c = o.getZ(n);
          s < i && (i = s),
            s > f && (f = s),
            a < u && (u = a),
            a > h && (h = a),
            c < d && (d = c),
            c > p && (p = c);
        }
      }
      return (
        (c[n + 0] !== i ||
          c[n + 1] !== u ||
          c[n + 2] !== d ||
          c[n + 3] !== f ||
          c[n + 4] !== h ||
          c[n + 5] !== p) &&
        ((c[n + 0] = i),
        (c[n + 1] = u),
        (c[n + 2] = d),
        (c[n + 3] = f),
        (c[n + 4] = h),
        (c[n + 5] = p),
        !0)
      );
    }
    {
      const t = n + 8,
        r = s[n + 6],
        o = t + i,
        a = r + i;
      let l = u,
        f = !1,
        h = !1;
      e
        ? l || ((f = e.has(o)), (h = e.has(a)), (l = !f && !h))
        : ((f = !0), (h = !0));
      const p = l || h;
      let y = !1;
      (l || f) && (y = d(t, i, l));
      let m = !1;
      p && (m = d(r, i, l));
      const x = y || m;
      if (x)
        for (let e = 0; e < 3; e++) {
          const o = t + e,
            i = r + e,
            s = c[o],
            a = c[o + 3],
            u = c[i],
            l = c[i + 3];
          (c[n + e] = s < u ? s : u), (c[n + e + 3] = a > l ? a : l);
        }
      return x;
    }
  }
}
function Ve(t, e, n, r, o) {
  qt.setBuffer(t._roots[e]), Oe(0, t, n, r, o), qt.clearBuffer();
}
function Oe(t, e, n, r, o) {
  const { float32Array: i, uint16Array: s, uint32Array: a } = qt,
    c = 2 * t;
  if (ht(c, s)) {
    !(function (t, e, n, r, o, i) {
      const { geometry: s, _indirectBuffer: a } = t;
      for (let t = r, c = r + o; t < c; t++) ie(s, e, n, a ? a[t] : t, i);
    })(e, n, r, pt(t, a), yt(c, s), o);
  } else {
    const s = mt(t);
    me(s, i, r) && Oe(s, e, n, r, o);
    const c = xt(t, a);
    me(c, i, r) && Oe(c, e, n, r, o);
  }
}
const Re = ["x", "y", "z"];
function We(t, e, n, r) {
  qt.setBuffer(t._roots[e]);
  const o = Ge(0, t, n, r);
  return qt.clearBuffer(), o;
}
function Ge(t, e, n, r) {
  const { float32Array: o, uint16Array: i, uint32Array: s } = qt;
  let a = 2 * t;
  if (ht(a, i)) {
    return (function (t, e, n, r, o) {
      const { geometry: i, _indirectBuffer: s } = t;
      let a = 1 / 0,
        c = null;
      for (let t = r, u = r + o; t < u; t++) {
        let r;
        (r = ie(i, e, n, s ? s[t] : t)),
          r && r.distance < a && ((c = r), (a = r.distance));
      }
      return c;
    })(e, n, r, pt(t, s), yt(a, i));
  }
  {
    const i = gt(t, s),
      a = Re[i],
      c = r.direction[a] >= 0;
    let u, l;
    c ? ((u = mt(t)), (l = xt(t, s))) : ((u = xt(t, s)), (l = mt(t)));
    const d = me(u, o, r) ? Ge(u, e, n, r) : null;
    if (d) {
      const t = d.point[a];
      if (c ? t <= o[l + i] : t >= o[l + i + 3]) return d;
    }
    const f = me(l, o, r) ? Ge(l, e, n, r) : null;
    return d && f ? (d.distance <= f.distance ? d : f) : d || f || null;
  }
}
const Xe = new c(),
  Le = new Et(),
  Ye = new Et(),
  Ze = new a(),
  je = new Nt(),
  Ke = new Nt();
function $e(t, e, n, r) {
  qt.setBuffer(t._roots[e]);
  const o = Je(0, t, n, r);
  return qt.clearBuffer(), o;
}
function Je(t, e, n, r, o = null) {
  const { float32Array: i, uint16Array: s, uint32Array: a } = qt;
  let c = 2 * t;
  null === o &&
    (n.boundingBox || n.computeBoundingBox(),
    je.set(n.boundingBox.min, n.boundingBox.max, r),
    (o = je));
  if (!ht(c, s)) {
    const s = t + 8,
      c = a[t + 6];
    tt(s, i, Xe);
    if (o.intersectsBox(Xe) && Je(s, e, n, r, o)) return !0;
    tt(c, i, Xe);
    return !!(o.intersectsBox(Xe) && Je(c, e, n, r, o));
  }
  {
    const o = e.geometry,
      u = o.index,
      l = o.attributes.position,
      d = n.index,
      f = n.attributes.position,
      h = pt(t, a),
      p = yt(c, s);
    if ((Ze.copy(r).invert(), n.boundsTree)) {
      tt(t, i, Ke), Ke.matrix.copy(Ze), (Ke.needsUpdate = !0);
      return n.boundsTree.shapecast({
        intersectsBounds: (t) => Ke.intersectsBox(t),
        intersectsTriangle: (t) => {
          t.a.applyMatrix4(r),
            t.b.applyMatrix4(r),
            t.c.applyMatrix4(r),
            (t.needsUpdate = !0);
          for (let n = h, r = p + h; n < r; n++)
            if (
              (se(Ye, 3 * e.resolveTriangleIndex(n), u, l),
              (Ye.needsUpdate = !0),
              t.intersectsTriangle(Ye))
            )
              return !0;
          return !1;
        },
      });
    }
    for (let t = h, n = p + h; t < n; t++) {
      const n = e.resolveTriangleIndex(t);
      se(Le, 3 * n, u, l),
        Le.a.applyMatrix4(Ze),
        Le.b.applyMatrix4(Ze),
        Le.c.applyMatrix4(Ze),
        (Le.needsUpdate = !0);
      for (let t = 0, e = d.count; t < e; t += 3)
        if ((se(Ye, t, d, f), (Ye.needsUpdate = !0), Le.intersectsTriangle(Ye)))
          return !0;
    }
  }
}
const Qe = new a(),
  tn = new Nt(),
  en = new Nt(),
  nn = new e(),
  rn = new e(),
  on = new e(),
  sn = new e();
function an(t, e, n, r = {}, o = {}, i = 0, s = 1 / 0) {
  e.boundingBox || e.computeBoundingBox(),
    tn.set(e.boundingBox.min, e.boundingBox.max, n),
    (tn.needsUpdate = !0);
  const a = t.geometry,
    c = a.attributes.position,
    u = a.index,
    l = e.attributes.position,
    d = e.index,
    f = Ht.getPrimitive(),
    h = Ht.getPrimitive();
  let p = nn,
    y = rn,
    m = null,
    x = null;
  o && ((m = on), (x = sn));
  let g = 1 / 0,
    b = null,
    v = null;
  return (
    Qe.copy(n).invert(),
    en.matrix.copy(Qe),
    t.shapecast({
      boundsTraverseOrder: (t) => tn.distanceToBox(t),
      intersectsBounds: (t, e, n) =>
        n < g &&
        n < s &&
        (e && (en.min.copy(t.min), en.max.copy(t.max), (en.needsUpdate = !0)),
        !0),
      intersectsRange: (r, o) => {
        if (e.boundsTree) {
          const a = e.boundsTree;
          return a.shapecast({
            boundsTraverseOrder: (t) => en.distanceToBox(t),
            intersectsBounds: (t, e, n) => n < g && n < s,
            intersectsRange: (e, s) => {
              for (let w = e, B = e + s; w < B; w++) {
                const e = a.resolveTriangleIndex(w);
                se(h, 3 * e, d, l),
                  h.a.applyMatrix4(n),
                  h.b.applyMatrix4(n),
                  h.c.applyMatrix4(n),
                  (h.needsUpdate = !0);
                for (let e = r, n = r + o; e < n; e++) {
                  const n = t.resolveTriangleIndex(e);
                  se(f, 3 * n, u, c), (f.needsUpdate = !0);
                  const r = f.distanceToTriangle(h, p, m);
                  if (
                    (r < g &&
                      (y.copy(p), x && x.copy(m), (g = r), (b = e), (v = w)),
                    r < i)
                  )
                    return !0;
                }
              }
            },
          });
        }
        for (let s = 0, a = j(e); s < a; s++) {
          se(h, 3 * s, d, l),
            h.a.applyMatrix4(n),
            h.b.applyMatrix4(n),
            h.c.applyMatrix4(n),
            (h.needsUpdate = !0);
          for (let e = r, n = r + o; e < n; e++) {
            const n = t.resolveTriangleIndex(e);
            se(f, 3 * n, u, c), (f.needsUpdate = !0);
            const r = f.distanceToTriangle(h, p, m);
            if (
              (r < g && (y.copy(p), x && x.copy(m), (g = r), (b = e), (v = s)),
              r < i)
            )
              return !0;
          }
        }
      },
    }),
    Ht.releasePrimitive(f),
    Ht.releasePrimitive(h),
    g === 1 / 0
      ? null
      : (r.point ? r.point.copy(y) : (r.point = y.clone()),
        (r.distance = g),
        (r.faceIndex = b),
        o &&
          (o.point ? o.point.copy(x) : (o.point = x.clone()),
          o.point.applyMatrix4(Qe),
          y.applyMatrix4(Qe),
          (o.distance = y.sub(o.point).length()),
          (o.faceIndex = v)),
        r)
  );
}
function cn() {
  return "undefined" != typeof SharedArrayBuffer;
}
const un = new qt.constructor(),
  ln = new qt.constructor(),
  dn = new kt(() => new c()),
  fn = new c(),
  hn = new c(),
  pn = new c(),
  yn = new c();
let mn = !1;
function xn(t, e, n, r, o, i = 0, s = 0, a = 0, c = 0, u = null, l = !1) {
  let d, f;
  l ? ((d = ln), (f = un)) : ((d = un), (f = ln));
  const h = d.float32Array,
    p = d.uint32Array,
    y = d.uint16Array,
    m = f.float32Array,
    x = f.uint32Array,
    g = f.uint16Array,
    b = 2 * e,
    v = ht(2 * t, y),
    w = ht(b, g);
  let B = !1;
  if (w && v)
    B = l
      ? o(pt(e, x), yt(2 * e, g), pt(t, p), yt(2 * t, y), c, s + e, a, i + t)
      : o(pt(t, p), yt(2 * t, y), pt(e, x), yt(2 * e, g), a, i + t, c, s + e);
  else if (w) {
    const u = dn.getPrimitive();
    tt(e, m, u), u.applyMatrix4(n);
    const d = mt(t),
      f = xt(t, p);
    tt(d, h, fn), tt(f, h, hn);
    const y = u.intersectsBox(fn),
      x = u.intersectsBox(hn);
    (B =
      (y && xn(e, d, r, n, o, s, i, c, a + 1, u, !l)) ||
      (x && xn(e, f, r, n, o, s, i, c, a + 1, u, !l))),
      dn.releasePrimitive(u);
  } else {
    const d = mt(e),
      f = xt(e, x);
    tt(d, m, pn), tt(f, m, yn);
    const y = u.intersectsBox(pn),
      g = u.intersectsBox(yn);
    if (y && g)
      B =
        xn(t, d, n, r, o, i, s, a, c + 1, u, l) ||
        xn(t, f, n, r, o, i, s, a, c + 1, u, l);
    else if (y)
      if (v) B = xn(t, d, n, r, o, i, s, a, c + 1, u, l);
      else {
        const e = dn.getPrimitive();
        e.copy(pn).applyMatrix4(n);
        const u = mt(t),
          f = xt(t, p);
        tt(u, h, fn), tt(f, h, hn);
        const y = e.intersectsBox(fn),
          m = e.intersectsBox(hn);
        (B =
          (y && xn(d, u, r, n, o, s, i, c, a + 1, e, !l)) ||
          (m && xn(d, f, r, n, o, s, i, c, a + 1, e, !l))),
          dn.releasePrimitive(e);
      }
    else if (g)
      if (v) B = xn(t, f, n, r, o, i, s, a, c + 1, u, l);
      else {
        const e = dn.getPrimitive();
        e.copy(yn).applyMatrix4(n);
        const u = mt(t),
          d = xt(t, p);
        tt(u, h, fn), tt(d, h, hn);
        const y = e.intersectsBox(fn),
          m = e.intersectsBox(hn);
        (B =
          (y && xn(f, u, r, n, o, s, i, c, a + 1, e, !l)) ||
          (m && xn(f, d, r, n, o, s, i, c, a + 1, e, !l))),
          dn.releasePrimitive(e);
      }
  }
  return B;
}
const gn = new Nt(),
  bn = new c(),
  vn = {
    strategy: k,
    maxDepth: 40,
    maxLeafTris: 10,
    useSharedArrayBuffer: !1,
    setBoundingBox: !0,
    onProgress: null,
    indirect: !1,
    verbose: !0,
  };
class wn {
  static serialize(t, e = {}) {
    e = { cloneBuffers: !0, ...e };
    const n = t.geometry,
      r = t._roots,
      o = t._indirectBuffer,
      i = n.getIndex();
    let s;
    return (
      (s = e.cloneBuffers
        ? {
            roots: r.map((t) => t.slice()),
            index: i ? i.array.slice() : null,
            indirectBuffer: o ? o.slice() : null,
          }
        : { roots: r, index: i ? i.array : null, indirectBuffer: o }),
      s
    );
  }
  static deserialize(e, n, r = {}) {
    r = { setIndex: !0, indirect: Boolean(e.indirectBuffer), ...r };
    const { index: o, roots: i, indirectBuffer: s } = e,
      a = new wn(n, { ...r, [Y]: !0 });
    if (((a._roots = i), (a._indirectBuffer = s || null), r.setIndex)) {
      const r = n.getIndex();
      if (null === r) {
        const r = new t(e.index, 1, !1);
        n.setIndex(r);
      } else r.array !== o && (r.array.set(o), (r.needsUpdate = !0));
    }
    return a;
  }
  get indirect() {
    return !!this._indirectBuffer;
  }
  constructor(t, e = {}) {
    if (!t.isBufferGeometry)
      throw new Error("MeshBVH: Only BufferGeometries are supported.");
    if (t.index && t.index.isInterleavedBufferAttribute)
      throw new Error(
        "MeshBVH: InterleavedBufferAttribute is not supported for the index attribute."
      );
    if (
      (e = Object.assign({ ...vn, [Y]: !1 }, e)).useSharedArrayBuffer &&
      !cn()
    )
      throw new Error("MeshBVH: SharedArrayBuffer is not available.");
    (this.geometry = t),
      (this._roots = null),
      (this._indirectBuffer = null),
      e[Y] ||
        (_t(this, e),
        !t.boundingBox &&
          e.setBoundingBox &&
          (t.boundingBox = this.getBoundingBox(new c())));
    const { _indirectBuffer: n } = this;
    this.resolveTriangleIndex = e.indirect ? (t) => n[t] : (t) => t;
  }
  refit(t = null) {
    return (this.indirect ? qe : ye)(this, t);
  }
  traverse(t, e = 0) {
    const n = this._roots[e],
      r = new Uint32Array(n),
      o = new Uint16Array(n);
    !(function e(i, s = 0) {
      const a = 2 * i,
        c = o[a + 15] === X;
      if (c) {
        const e = r[i + 6],
          u = o[a + 14];
        t(s, c, new Float32Array(n, 4 * i, 6), e, u);
      } else {
        const o = i + G / 4,
          a = r[i + 6],
          u = r[i + 7];
        t(s, c, new Float32Array(n, 4 * i, 6), u) || (e(o, s + 1), e(a, s + 1));
      }
    })(0);
  }
  raycast(t, e = d) {
    const n = this._roots,
      r = this.geometry,
      o = [],
      i = e.isMaterial,
      s = Array.isArray(e),
      a = r.groups,
      c = i ? e.side : e,
      u = this.indirect ? Ve : ge;
    for (let r = 0, i = n.length; r < i; r++) {
      const n = s ? e[a[r].materialIndex].side : c,
        i = o.length;
      if ((u(this, r, n, t, o), s)) {
        const t = a[r].materialIndex;
        for (let e = i, n = o.length; e < n; e++) o[e].face.materialIndex = t;
      }
    }
    return o;
  }
  raycastFirst(t, e = d) {
    const n = this._roots,
      r = this.geometry,
      o = e.isMaterial,
      i = Array.isArray(e);
    let s = null;
    const a = r.groups,
      c = o ? e.side : e,
      u = this.indirect ? We : we;
    for (let r = 0, o = n.length; r < o; r++) {
      const n = u(this, r, i ? e[a[r].materialIndex].side : c, t);
      null != n &&
        (null == s || n.distance < s.distance) &&
        ((s = n), i && (n.face.materialIndex = a[r].materialIndex));
    }
    return s;
  }
  intersectsGeometry(t, e) {
    let n = !1;
    const r = this._roots,
      o = this.indirect ? $e : Se;
    for (let i = 0, s = r.length; i < s && ((n = o(this, i, t, e)), !n); i++);
    return n;
  }
  shapecast(t) {
    const e = Ht.getPrimitive(),
      n = this.indirect ? xe : pe;
    let {
      boundsTraverseOrder: r,
      intersectsBounds: o,
      intersectsRange: i,
      intersectsTriangle: s,
    } = t;
    if (i && s) {
      const t = i;
      i = (r, o, i, a, c) => !!t(r, o, i, a, c) || n(r, o, this, s, i, a, e);
    } else
      i || (i = s ? (t, r, o, i) => n(t, r, this, s, o, i, e) : (t, e, n) => n);
    let a = !1,
      c = 0;
    const u = this._roots;
    for (let t = 0, e = u.length; t < e; t++) {
      const e = u[t];
      if (((a = Gt(this, t, o, i, r, c)), a)) break;
      c += e.byteLength;
    }
    return Ht.releasePrimitive(e), a;
  }
  bvhcast(t, e, n) {
    let { intersectsRanges: r, intersectsTriangles: o } = n;
    const i = Ht.getPrimitive(),
      s = this.geometry.index,
      c = this.geometry.attributes.position,
      u = this.indirect
        ? (t) => {
            const e = this.resolveTriangleIndex(t);
            se(i, 3 * e, s, c);
          }
        : (t) => {
            se(i, 3 * t, s, c);
          },
      l = Ht.getPrimitive(),
      d = t.geometry.index,
      f = t.geometry.attributes.position,
      h = t.indirect
        ? (e) => {
            const n = t.resolveTriangleIndex(e);
            se(l, 3 * n, d, f);
          }
        : (t) => {
            se(l, 3 * t, d, f);
          };
    if (o) {
      const t = (t, n, r, s, a, c, d, f) => {
        for (let p = r, y = r + s; p < y; p++) {
          h(p),
            l.a.applyMatrix4(e),
            l.b.applyMatrix4(e),
            l.c.applyMatrix4(e),
            (l.needsUpdate = !0);
          for (let e = t, r = t + n; e < r; e++)
            if ((u(e), (i.needsUpdate = !0), o(i, l, e, p, a, c, d, f)))
              return !0;
        }
        return !1;
      };
      if (r) {
        const e = r;
        r = function (n, r, o, i, s, a, c, u) {
          return !!e(n, r, o, i, s, a, c, u) || t(n, r, o, i, s, a, c, u);
        };
      } else r = t;
    }
    return (function (t, e, n, r) {
      if (mn)
        throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");
      mn = !0;
      const o = t._roots,
        i = e._roots;
      let s,
        c = 0,
        u = 0;
      const l = new a().copy(n).invert();
      for (let t = 0, e = o.length; t < e; t++) {
        un.setBuffer(o[t]), (u = 0);
        const e = dn.getPrimitive();
        tt(0, un.float32Array, e), e.applyMatrix4(l);
        for (
          let o = 0, a = i.length;
          o < a &&
          (ln.setBuffer(i[t]),
          (s = xn(0, 0, n, l, r, c, u, 0, 0, e)),
          ln.clearBuffer(),
          (u += i[o].length),
          !s);
          o++
        );
        if ((dn.releasePrimitive(e), un.clearBuffer(), (c += o[t].length), s))
          break;
      }
      return (mn = !1), s;
    })(this, t, e, r);
  }
  intersectsBox(t, e) {
    return (
      gn.set(t.min, t.max, e),
      (gn.needsUpdate = !0),
      this.shapecast({
        intersectsBounds: (t) => gn.intersectsBox(t),
        intersectsTriangle: (t) => gn.intersectsTriangle(t),
      })
    );
  }
  intersectsSphere(t) {
    return this.shapecast({
      intersectsBounds: (e) => t.intersectsBox(e),
      intersectsTriangle: (e) => e.intersectsSphere(t),
    });
  }
  closestPointToGeometry(t, e, n = {}, r = {}, o = 0, i = 1 / 0) {
    return (this.indirect ? an : He)(this, t, e, n, r, o, i);
  }
  closestPointToPoint(t, e = {}, n = 0, r = 1 / 0) {
    return (function (t, e, n = {}, r = 0, o = 1 / 0) {
      const i = r * r,
        s = o * o;
      let a = 1 / 0,
        c = null;
      if (
        (t.shapecast({
          boundsTraverseOrder: (t) => (
            Lt.copy(e).clamp(t.min, t.max), Lt.distanceToSquared(e)
          ),
          intersectsBounds: (t, e, n) => n < a && n < s,
          intersectsTriangle: (t, n) => {
            t.closestPointToPoint(e, Lt);
            const r = e.distanceToSquared(Lt);
            return r < a && (Yt.copy(Lt), (a = r), (c = n)), r < i;
          },
        }),
        a === 1 / 0)
      )
        return null;
      const u = Math.sqrt(a);
      return (
        n.point ? n.point.copy(Yt) : (n.point = Yt.clone()),
        (n.distance = u),
        (n.faceIndex = c),
        n
      );
    })(this, t, e, n, r);
  }
  getBoundingBox(t) {
    t.makeEmpty();
    return (
      this._roots.forEach((e) => {
        tt(0, new Float32Array(e), bn), t.union(bn);
      }),
      t
    );
  }
}
const Bn = new c();
class An extends y {
  get isMesh() {
    return !this.displayEdges;
  }
  get isLineSegments() {
    return this.displayEdges;
  }
  get isLine() {
    return this.displayEdges;
  }
  constructor(t, e, n = 10, r = 0) {
    super(),
      (this.material = e),
      (this.geometry = new m()),
      (this.name = "MeshBVHRootHelper"),
      (this.depth = n),
      (this.displayParents = !1),
      (this.bvh = t),
      (this.displayEdges = !0),
      (this._group = r);
  }
  raycast() {}
  update() {
    const e = this.geometry,
      n = this.bvh,
      r = this._group;
    if ((e.dispose(), (this.visible = !1), n)) {
      const o = this.depth - 1,
        i = this.displayParents;
      let s = 0;
      n.traverse((t, e) => {
        if (t >= o || e) return s++, !0;
        i && s++;
      }, r);
      let a = 0;
      const c = new Float32Array(24 * s);
      let u, l;
      n.traverse((t, e, n) => {
        const r = t >= o || e;
        if (r || i) {
          tt(0, n, Bn);
          const { min: t, max: e } = Bn;
          for (let n = -1; n <= 1; n += 2) {
            const r = n < 0 ? t.x : e.x;
            for (let n = -1; n <= 1; n += 2) {
              const o = n < 0 ? t.y : e.y;
              for (let n = -1; n <= 1; n += 2) {
                const i = n < 0 ? t.z : e.z;
                (c[a + 0] = r), (c[a + 1] = o), (c[a + 2] = i), (a += 3);
              }
            }
          }
          return r;
        }
      }, r),
        (l = this.displayEdges
          ? new Uint8Array([
              0, 4, 1, 5, 2, 6, 3, 7, 0, 2, 1, 3, 4, 6, 5, 7, 0, 1, 2, 3, 4, 5,
              6, 7,
            ])
          : new Uint8Array([
              0, 1, 2, 2, 1, 3, 4, 6, 5, 6, 7, 5, 1, 4, 5, 0, 4, 1, 2, 3, 6, 3,
              7, 6, 0, 2, 4, 2, 6, 4, 1, 5, 3, 3, 5, 7,
            ])),
        (u =
          c.length > 65535
            ? new Uint32Array(l.length * s)
            : new Uint16Array(l.length * s));
      const d = l.length;
      for (let t = 0; t < s; t++) {
        const e = 8 * t,
          n = t * d;
        for (let t = 0; t < d; t++) u[n + t] = e + l[t];
      }
      e.setIndex(new t(u, 1, !1)),
        e.setAttribute("position", new t(c, 3, !1)),
        (this.visible = !0);
    }
  }
}
class Tn extends f {
  get color() {
    return this.edgeMaterial.color;
  }
  get opacity() {
    return this.edgeMaterial.opacity;
  }
  set opacity(t) {
    (this.edgeMaterial.opacity = t), (this.meshMaterial.opacity = t);
  }
  constructor(t = null, e = null, n = 10) {
    t instanceof wn && ((n = e || 10), (e = t), (t = null)),
      "number" == typeof e && ((n = e), (e = null)),
      super(),
      (this.name = "MeshBVHHelper"),
      (this.depth = n),
      (this.mesh = t),
      (this.bvh = e),
      (this.displayParents = !1),
      (this.displayEdges = !0),
      (this._roots = []);
    const r = new h({
        color: 65416,
        transparent: !0,
        opacity: 0.3,
        depthWrite: !1,
      }),
      o = new p({
        color: 65416,
        transparent: !0,
        opacity: 0.3,
        depthWrite: !1,
      });
    (o.color = r.color),
      (this.edgeMaterial = r),
      (this.meshMaterial = o),
      this.update();
  }
  update() {
    const t = this.bvh || this.mesh.geometry.boundsTree,
      e = t ? t._roots.length : 0;
    for (; this._roots.length > e; ) {
      const t = this._roots.pop();
      t.geometry.dispose(), this.remove(t);
    }
    for (let n = 0; n < e; n++) {
      const {
        depth: e,
        edgeMaterial: r,
        meshMaterial: o,
        displayParents: i,
        displayEdges: s,
      } = this;
      if (n >= this._roots.length) {
        const o = new An(t, r, e, n);
        this.add(o), this._roots.push(o);
      }
      const a = this._roots[n];
      (a.bvh = t),
        (a.depth = e),
        (a.displayParents = i),
        (a.displayEdges = s),
        (a.material = s ? r : o),
        a.update();
    }
  }
  updateMatrixWorld(...t) {
    const e = this.mesh,
      n = this.parent;
    null !== e &&
      (e.updateWorldMatrix(!0, !1),
      n
        ? this.matrix.copy(n.matrixWorld).invert().multiply(e.matrixWorld)
        : this.matrix.copy(e.matrixWorld),
      this.matrix.decompose(this.position, this.quaternion, this.scale)),
      super.updateMatrixWorld(...t);
  }
  copy(t) {
    (this.depth = t.depth),
      (this.mesh = t.mesh),
      (this.bvh = t.bvh),
      (this.opacity = t.opacity),
      this.color.copy(t.color);
  }
  clone() {
    return new Tn(this.mesh, this.bvh, this.depth);
  }
  dispose() {
    this.edgeMaterial.dispose(), this.meshMaterial.dispose();
    const t = this.children;
    for (let e = 0, n = t.length; e < n; e++) t[e].geometry.dispose();
  }
}
const Mn = new c(),
  Pn = new c(),
  In = new e();
function _n(t) {
  switch (typeof t) {
    case "number":
      return 8;
    case "string":
      return 2 * t.length;
    case "boolean":
      return 4;
    default:
      return 0;
  }
}
function Sn(t) {
  return t._roots.map((e, n) =>
    (function (t, e) {
      const n = {
        nodeCount: 0,
        leafNodeCount: 0,
        depth: { min: 1 / 0, max: -1 / 0 },
        tris: { min: 1 / 0, max: -1 / 0 },
        splits: [0, 0, 0],
        surfaceAreaScore: 0,
      };
      return (
        t.traverse((t, e, r, o, i) => {
          const s = r[3] - r[0],
            a = r[4] - r[1],
            c = r[5] - r[2],
            u = 2 * (s * a + a * c + c * s);
          n.nodeCount++,
            e
              ? (n.leafNodeCount++,
                (n.depth.min = Math.min(t, n.depth.min)),
                (n.depth.max = Math.max(t, n.depth.max)),
                (n.tris.min = Math.min(i, n.tris.min)),
                (n.tris.max = Math.max(i, n.tris.max)),
                (n.surfaceAreaScore += u * R * i))
              : (n.splits[o]++, (n.surfaceAreaScore += u * W));
        }, e),
        n.tris.min === 1 / 0 && ((n.tris.min = 0), (n.tris.max = 0)),
        n.depth.min === 1 / 0 && ((n.depth.min = 0), (n.depth.max = 0)),
        n
      );
    })(t, n)
  );
}
function Dn(t) {
  const e = new Set(),
    n = [t];
  let r = 0;
  for (; n.length; ) {
    const t = n.pop();
    if (!e.has(t)) {
      e.add(t);
      for (let e in t) {
        if (!t.hasOwnProperty(e)) continue;
        r += _n(e);
        const o = t[e];
        !o || ("object" != typeof o && "function" != typeof o)
          ? (r += _n(o))
          : /(Uint|Int|Float)(8|16|32)Array/.test(o.constructor.name) ||
            (cn() && o instanceof SharedArrayBuffer) ||
            o instanceof ArrayBuffer
          ? (r += o.byteLength)
          : n.push(o);
      }
    }
  }
  return r;
}
function Fn(t) {
  const e = t.geometry,
    n = [],
    r = e.index,
    o = e.getAttribute("position");
  let i = !0;
  return (
    t.traverse((e, s, a, c, u) => {
      const l = { depth: e, isLeaf: s, boundingData: a, offset: c, count: u };
      (n[e] = l), tt(0, a, Mn);
      const d = n[e - 1];
      if (s)
        for (let e = c, n = c + u; e < n; e++) {
          const n = t.resolveTriangleIndex(e);
          let s,
            a = 3 * n,
            c = 3 * n + 1,
            u = 3 * n + 2;
          r && ((a = r.getX(a)), (c = r.getX(c)), (u = r.getX(u))),
            In.fromBufferAttribute(o, a),
            (s = Mn.containsPoint(In)),
            In.fromBufferAttribute(o, c),
            (s = s && Mn.containsPoint(In)),
            In.fromBufferAttribute(o, u),
            (s = s && Mn.containsPoint(In)),
            console.assert(s, "Leaf bounds does not fully contain triangle."),
            (i = i && s);
        }
      if (d) {
        tt(0, a, Pn);
        const t = Pn.containsBox(Mn);
        console.assert(t, "Parent bounds does not fully contain child."),
          (i = i && t);
      }
    }),
    i
  );
}
function zn(t) {
  const e = [];
  return (
    t.traverse((t, n, r, o, i) => {
      const s = { bounds: tt(0, r, new c()) };
      n ? ((s.count = i), (s.offset = o)) : ((s.left = null), (s.right = null)),
        (e[t] = s);
      const a = e[t - 1];
      a && (null === a.left ? (a.left = s) : (a.right = s));
    }),
    e[0]
  );
}
function Un(t, e, n) {
  return null === t
    ? null
    : (t.point.applyMatrix4(e.matrixWorld),
      (t.distance = t.point.distanceTo(n.ray.origin)),
      (t.object = e),
      t.distance < n.near || t.distance > n.far ? null : t);
}
const En = new g(),
  Nn = new a(),
  kn = x.prototype.raycast;
function Cn(t, e) {
  if (this.geometry.boundsTree) {
    if (void 0 === this.material) return;
    Nn.copy(this.matrixWorld).invert(), En.copy(t.ray).applyMatrix4(Nn);
    const n = this.geometry.boundsTree;
    if (!0 === t.firstHitOnly) {
      const r = Un(n.raycastFirst(En, this.material), this, t);
      r && e.push(r);
    } else {
      const r = n.raycast(En, this.material);
      for (let n = 0, o = r.length; n < o; n++) {
        const o = Un(r[n], this, t);
        o && e.push(o);
      }
    }
  } else kn.call(this, t, e);
}
function Hn(t) {
  return (this.boundsTree = new wn(this, t)), this.boundsTree;
}
function qn() {
  this.boundsTree = null;
}
function Vn(t) {
  switch (t) {
    case 1:
      return U;
    case 2:
      return z;
    case 3:
    case 4:
      return S;
  }
}
class On extends b {
  constructor() {
    super(),
      (this.minFilter = v),
      (this.magFilter = v),
      (this.generateMipmaps = !1),
      (this.overrideItemSize = null),
      (this._forcedType = null);
  }
  updateFrom(t) {
    const e = this.overrideItemSize,
      n = t.itemSize,
      r = t.count;
    if (null !== e) {
      if ((n * r) % e != 0)
        throw new Error(
          "VertexAttributeTexture: overrideItemSize must divide evenly into buffer length."
        );
      (t.itemSize = e), (t.count = (r * n) / e);
    }
    const o = t.itemSize,
      i = t.count,
      s = t.normalized,
      a = t.array.constructor,
      c = a.BYTES_PER_ELEMENT;
    let u,
      l,
      d,
      f,
      h = this._forcedType,
      p = o;
    if (null === h)
      switch (a) {
        case Float32Array:
          h = A;
          break;
        case Uint8Array:
        case Uint16Array:
        case Uint32Array:
          h = w;
          break;
        case Int8Array:
        case Int16Array:
        case Int32Array:
          h = B;
      }
    let y = (function (t) {
      switch (t) {
        case 1:
          return "R";
        case 2:
          return "RG";
        case 3:
        case 4:
          return "RGBA";
      }
      throw new Error();
    })(o);
    switch (h) {
      case A:
        (d = 1),
          (l = (function (t) {
            switch (t) {
              case 1:
                return F;
              case 2:
                return D;
              case 3:
              case 4:
                return _;
            }
          })(o)),
          s && 1 === c
            ? ((f = a),
              (y += "8"),
              a === Uint8Array ? (u = T) : ((u = P), (y += "_SNORM")))
            : ((f = Float32Array), (y += "32F"), (u = A));
        break;
      case B:
        (y += 8 * c + "I"),
          (d = s ? Math.pow(2, 8 * a.BYTES_PER_ELEMENT - 1) : 1),
          (l = Vn(o)),
          1 === c
            ? ((f = Int8Array), (u = P))
            : 2 === c
            ? ((f = Int16Array), (u = I))
            : ((f = Int32Array), (u = B));
        break;
      case w:
        (y += 8 * c + "UI"),
          (d = s ? Math.pow(2, 8 * a.BYTES_PER_ELEMENT - 1) : 1),
          (l = Vn(o)),
          1 === c
            ? ((f = Uint8Array), (u = T))
            : 2 === c
            ? ((f = Uint16Array), (u = M))
            : ((f = Uint32Array), (u = w));
    }
    3 !== p || (l !== _ && l !== S) || (p = 4);
    const m = Math.ceil(Math.sqrt(i)) || 1,
      x = new f(p * m * m),
      g = t.normalized;
    t.normalized = !1;
    for (let e = 0; e < i; e++) {
      const n = p * e;
      (x[n] = t.getX(e) / d),
        o >= 2 && (x[n + 1] = t.getY(e) / d),
        o >= 3 && ((x[n + 2] = t.getZ(e) / d), 4 === p && (x[n + 3] = 1)),
        o >= 4 && (x[n + 3] = t.getW(e) / d);
    }
    (t.normalized = g),
      (this.internalFormat = y),
      (this.format = l),
      (this.type = u),
      (this.image.width = m),
      (this.image.height = m),
      (this.image.data = x),
      (this.needsUpdate = !0),
      this.dispose(),
      (t.itemSize = n),
      (t.count = r);
  }
}
class Rn extends On {
  constructor() {
    super(), (this._forcedType = w);
  }
}
class Wn extends On {
  constructor() {
    super(), (this._forcedType = B);
  }
}
class Gn extends On {
  constructor() {
    super(), (this._forcedType = A);
  }
}
class Xn {
  constructor() {
    (this.index = new Rn()),
      (this.position = new Gn()),
      (this.bvhBounds = new b()),
      (this.bvhContents = new b()),
      (this._cachedIndexAttr = null),
      (this.index.overrideItemSize = 3);
  }
  updateFrom(e) {
    const { geometry: n } = e;
    if (
      ((function (t, e, n) {
        const r = t._roots;
        if (1 !== r.length)
          throw new Error(
            "MeshBVHUniformStruct: Multi-root BVHs not supported."
          );
        const o = r[0],
          i = new Uint16Array(o),
          s = new Uint32Array(o),
          a = new Float32Array(o),
          c = o.byteLength / G,
          u = 2 * Math.ceil(Math.sqrt(c / 2)),
          l = new Float32Array(4 * u * u),
          d = Math.ceil(Math.sqrt(c)),
          f = new Uint32Array(2 * d * d);
        for (let t = 0; t < c; t++) {
          const e = (t * G) / 4,
            n = 2 * e,
            r = e;
          for (let e = 0; e < 3; e++)
            (l[8 * t + 0 + e] = a[r + 0 + e]),
              (l[8 * t + 4 + e] = a[r + 3 + e]);
          if (ht(n, i)) {
            const r = yt(n, i),
              o = pt(e, s),
              a = 4294901760 | r;
            (f[2 * t + 0] = a), (f[2 * t + 1] = o);
          } else {
            const n = (4 * xt(e, s)) / G,
              r = gt(e, s);
            (f[2 * t + 0] = r), (f[2 * t + 1] = n);
          }
        }
        (e.image.data = l),
          (e.image.width = u),
          (e.image.height = u),
          (e.format = _),
          (e.type = A),
          (e.internalFormat = "RGBA32F"),
          (e.minFilter = v),
          (e.magFilter = v),
          (e.generateMipmaps = !1),
          (e.needsUpdate = !0),
          e.dispose(),
          (n.image.data = f),
          (n.image.width = d),
          (n.image.height = d),
          (n.format = z),
          (n.type = w),
          (n.internalFormat = "RG32UI"),
          (n.minFilter = v),
          (n.magFilter = v),
          (n.generateMipmaps = !1),
          (n.needsUpdate = !0),
          n.dispose();
      })(e, this.bvhBounds, this.bvhContents),
      this.position.updateFrom(n.attributes.position),
      e.indirect)
    ) {
      const r = e._indirectBuffer;
      if (
        null === this._cachedIndexAttr ||
        this._cachedIndexAttr.count !== r.length
      )
        if (n.index) this._cachedIndexAttr = n.index.clone();
        else {
          const e = K(Z(n));
          this._cachedIndexAttr = new t(e, 1, !1);
        }
      !(function (t, e, n) {
        const r = n.array,
          o = t.index ? t.index.array : null;
        for (let t = 0, n = e.length; t < n; t++) {
          const n = 3 * t,
            i = 3 * e[t];
          for (let t = 0; t < 3; t++) r[n + t] = o ? o[i + t] : i + t;
        }
      })(n, r, this._cachedIndexAttr),
        this.index.updateFrom(this._cachedIndexAttr);
    } else this.index.updateFrom(n.index);
  }
  dispose() {
    const { index: t, position: e, bvhBounds: n, bvhContents: r } = this;
    t && t.dispose(), e && e.dispose(), n && n.dispose(), r && r.dispose();
  }
}
const Ln = new e(),
  Yn = new e(),
  Zn = new e(),
  jn = new N(),
  Kn = new e(),
  $n = new e(),
  Jn = new N(),
  Qn = new N(),
  tr = new a(),
  er = new a();
function nr(t, e) {
  if (!t && !e) return;
  const n = t.count === e.count,
    r = t.normalized === e.normalized,
    o = t.array.constructor === e.array.constructor,
    i = t.itemSize === e.itemSize;
  if (!(n && r && o && i)) throw new Error();
}
function rr(e, n = null) {
  const r = e.array.constructor,
    o = e.normalized,
    i = e.itemSize,
    s = null === n ? e.count : n;
  return new t(new r(i * s), i, o);
}
function or(t, e, n = 0) {
  if (t.isInterleavedBufferAttribute) {
    const r = t.itemSize;
    for (let o = 0, i = t.count; o < i; o++) {
      const i = o + n;
      e.setX(i, t.getX(o)),
        r >= 2 && e.setY(i, t.getY(o)),
        r >= 3 && e.setZ(i, t.getZ(o)),
        r >= 4 && e.setW(i, t.getW(o));
    }
  } else {
    const r = e.array,
      o = r.constructor,
      i = r.BYTES_PER_ELEMENT * t.itemSize * n;
    new o(r.buffer, i, t.array.length).set(t.array);
  }
}
function ir(t, e, n) {
  const r = t.elements,
    o = e.elements;
  for (let t = 0, e = o.length; t < e; t++) r[t] += o[t] * n;
}
function sr(t, e, n) {
  const r = t.skeleton,
    o = t.geometry,
    i = r.bones,
    s = r.boneInverses;
  Jn.fromBufferAttribute(o.attributes.skinIndex, e),
    Qn.fromBufferAttribute(o.attributes.skinWeight, e),
    tr.elements.fill(0);
  for (let t = 0; t < 4; t++) {
    const e = Qn.getComponent(t);
    if (0 !== e) {
      const n = Jn.getComponent(t);
      er.multiplyMatrices(i[n].matrixWorld, s[n]), ir(tr, er, e);
    }
  }
  return (
    tr.multiply(t.bindMatrix).premultiply(t.bindMatrixInverse),
    n.transformDirection(tr),
    n
  );
}
function ar(t, e, n, r, o) {
  Kn.set(0, 0, 0);
  for (let i = 0, s = t.length; i < s; i++) {
    const s = e[i],
      a = t[i];
    0 !== s &&
      ($n.fromBufferAttribute(a, r),
      n ? Kn.addScaledVector($n, s) : Kn.addScaledVector($n.sub(o), s));
  }
  o.add(Kn);
}
class cr {
  constructor(t) {
    (this.matrixWorld = new a()),
      (this.geometryHash = null),
      (this.boneMatrices = null),
      (this.primitiveCount = -1),
      (this.mesh = t),
      this.update();
  }
  update() {
    const t = this.mesh,
      e = t.geometry,
      n = t.skeleton,
      r = (e.index ? e.index.count : e.attributes.position.count) / 3;
    if (
      (this.matrixWorld.copy(t.matrixWorld),
      (this.geometryHash = e.attributes.position.version),
      (this.primitiveCount = r),
      n)
    ) {
      n.boneTexture || n.computeBoneTexture(), n.update();
      const t = n.boneMatrices;
      this.boneMatrices && this.boneMatrices.length === t.length
        ? this.boneMatrices.set(t)
        : (this.boneMatrices = t.slice());
    } else this.boneMatrices = null;
  }
  didChange() {
    const t = this.mesh,
      e = t.geometry,
      n = (e.index ? e.index.count : e.attributes.position.count) / 3;
    return !(
      this.matrixWorld.equals(t.matrixWorld) &&
      this.geometryHash === e.attributes.position.version &&
      (function (t, e) {
        if (null === t || null === e) return t === e;
        if (t.length !== e.length) return !1;
        for (let n = 0, r = t.length; n < r; n++) if (t[n] !== e[n]) return !1;
        return !0;
      })((t.skeleton && t.skeleton.boneMatrices) || null, this.boneMatrices) &&
      this.primitiveCount === n
    );
  }
}
class ur {
  constructor(t) {
    Array.isArray(t) || (t = [t]);
    const e = [];
    t.forEach((t) => {
      t.traverseVisible((t) => {
        t.isMesh && e.push(t);
      });
    }),
      (this.meshes = e),
      (this.useGroups = !0),
      (this.applyWorldTransforms = !0),
      (this.attributes = [
        "position",
        "normal",
        "color",
        "tangent",
        "uv",
        "uv2",
      ]),
      (this._intermediateGeometry = new Array(e.length)
        .fill()
        .map(() => new m())),
      (this._diffMap = new WeakMap());
  }
  getMaterials() {
    const t = [];
    return (
      this.meshes.forEach((e) => {
        Array.isArray(e.material) ? t.push(...e.material) : t.push(e.material);
      }),
      t
    );
  }
  generate(e = new m()) {
    let n = [];
    const {
      meshes: r,
      useGroups: o,
      _intermediateGeometry: i,
      _diffMap: s,
    } = this;
    for (let t = 0, e = r.length; t < e; t++) {
      const e = r[t],
        o = i[t],
        a = s.get(e);
      !a || a.didChange(e)
        ? (this._convertToStaticGeometry(e, o),
          n.push(!1),
          a ? a.update() : s.set(e, new cr(e)))
        : n.push(!0);
    }
    if (0 === i.length) {
      e.setIndex(null);
      const n = e.attributes;
      for (const t in n) e.deleteAttribute(t);
      for (const n in this.attributes)
        e.setAttribute(this.attributes[n], new t(new Float32Array(0), 4, !1));
    } else
      !(function (
        e,
        n = { useGroups: !1, updateIndex: !1, skipAttributes: [] },
        r = new m()
      ) {
        const o = null !== e[0].index,
          {
            useGroups: i = !1,
            updateIndex: s = !1,
            skipAttributes: a = [],
          } = n,
          c = new Set(Object.keys(e[0].attributes)),
          u = {};
        let l = 0;
        r.clearGroups();
        for (let t = 0; t < e.length; ++t) {
          const n = e[t];
          let s = 0;
          if (o !== (null !== n.index))
            throw new Error(
              "StaticGeometryGenerator: All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."
            );
          for (const t in n.attributes) {
            if (!c.has(t))
              throw new Error(
                'StaticGeometryGenerator: All geometries must have compatible attributes; make sure "' +
                  t +
                  '" attribute exists among all geometries, or in none of them.'
              );
            void 0 === u[t] && (u[t] = []), u[t].push(n.attributes[t]), s++;
          }
          if (s !== c.size)
            throw new Error(
              "StaticGeometryGenerator: Make sure all geometries have the same number of attributes."
            );
          if (i) {
            let e;
            if (o) e = n.index.count;
            else {
              if (void 0 === n.attributes.position)
                throw new Error(
                  "StaticGeometryGenerator: The geometry must have either an index or a position attribute"
                );
              e = n.attributes.position.count;
            }
            r.addGroup(l, e, t), (l += e);
          }
        }
        if (o) {
          let n = !1;
          if (!r.index) {
            let o = 0;
            for (let t = 0; t < e.length; ++t) o += e[t].index.count;
            r.setIndex(new t(new Uint32Array(o), 1, !1)), (n = !0);
          }
          if (s || n) {
            const t = r.index;
            let n = 0,
              o = 0;
            for (let r = 0; r < e.length; ++r) {
              const i = e[r],
                s = i.index;
              if (!0 !== a[r])
                for (let e = 0; e < s.count; ++e) t.setX(n, s.getX(e) + o), n++;
              o += i.attributes.position.count;
            }
          }
        }
        for (const t in u) {
          const e = u[t];
          if (!(t in r.attributes)) {
            let n = 0;
            for (const t in e) n += e[t].count;
            r.setAttribute(t, rr(u[t][0], n));
          }
          const n = r.attributes[t];
          let o = 0;
          for (let t = 0, r = e.length; t < r; t++) {
            const r = e[t];
            !0 !== a[t] && or(r, n, o), (o += r.count);
          }
        }
      })(i, { useGroups: o, skipAttributes: n }, e);
    for (const t in e.attributes) e.attributes[t].needsUpdate = !0;
    return e;
  }
  _convertToStaticGeometry(t, e = new m()) {
    const n = t.geometry,
      r = this.applyWorldTransforms,
      o = this.attributes.includes("normal"),
      i = this.attributes.includes("tangent"),
      s = n.attributes,
      a = e.attributes;
    !e.index && n.index && (e.index = n.index.clone()),
      a.position || e.setAttribute("position", rr(s.position)),
      o && !a.normal && s.normal && e.setAttribute("normal", rr(s.normal)),
      i && !a.tangent && s.tangent && e.setAttribute("tangent", rr(s.tangent)),
      nr(n.index, e.index),
      nr(s.position, a.position),
      o && nr(s.normal, a.normal),
      i && nr(s.tangent, a.tangent);
    const c = s.position,
      u = o ? s.normal : null,
      l = i ? s.tangent : null,
      d = n.morphAttributes.position,
      f = n.morphAttributes.normal,
      h = n.morphAttributes.tangent,
      p = n.morphTargetsRelative,
      y = t.morphTargetInfluences,
      x = new E();
    x.getNormalMatrix(t.matrixWorld),
      n.index && e.index.array.set(n.index.array);
    for (let e = 0, n = s.position.count; e < n; e++)
      Ln.fromBufferAttribute(c, e),
        u && Yn.fromBufferAttribute(u, e),
        l && (jn.fromBufferAttribute(l, e), Zn.fromBufferAttribute(l, e)),
        y &&
          (d && ar(d, y, p, e, Ln),
          f && ar(f, y, p, e, Yn),
          h && ar(h, y, p, e, Zn)),
        t.isSkinnedMesh &&
          (t.applyBoneTransform(e, Ln), u && sr(t, e, Yn), l && sr(t, e, Zn)),
        r && Ln.applyMatrix4(t.matrixWorld),
        a.position.setXYZ(e, Ln.x, Ln.y, Ln.z),
        u &&
          (r && Yn.applyNormalMatrix(x), a.normal.setXYZ(e, Yn.x, Yn.y, Yn.z)),
        l &&
          (r && Zn.transformDirection(t.matrixWorld),
          a.tangent.setXYZW(e, Zn.x, Zn.y, Zn.z, jn.w));
    for (const t in this.attributes) {
      const n = this.attributes[t];
      "position" !== n &&
        "tangent" !== n &&
        "normal" !== n &&
        n in s &&
        (a[n] || e.setAttribute(n, rr(s[n])), nr(s[n], a[n]), or(s[n], a[n]));
    }
    return (
      t.matrixWorld.determinant() < 0 &&
        (function (t) {
          const { index: e, attributes: n } = t;
          if (e)
            for (let t = 0, n = e.count; t < n; t += 3) {
              const n = e.getX(t),
                r = e.getX(t + 2);
              e.setX(t, r), e.setX(t + 2, n);
            }
          else
            for (const t in n) {
              const e = n[t],
                r = e.itemSize;
              for (let t = 0, n = e.count; t < n; t += 3)
                for (let n = 0; n < r; n++) {
                  const r = e.getComponent(t, n),
                    o = e.getComponent(t + 2, n);
                  e.setComponent(t, n, o), e.setComponent(t + 2, n, r);
                }
            }
        })(e),
      e
    );
  }
}
const lr =
    "\n\n// A stack of uint32 indices can can store the indices for\n// a perfectly balanced tree with a depth up to 31. Lower stack\n// depth gets higher performance.\n//\n// However not all trees are balanced. Best value to set this to\n// is the trees max depth.\n#ifndef BVH_STACK_DEPTH\n#define BVH_STACK_DEPTH 60\n#endif\n\n#ifndef INFINITY\n#define INFINITY 1e20\n#endif\n\n// Utilities\nuvec4 uTexelFetch1D( usampler2D tex, uint index ) {\n\n\tuint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );\n\n}\n\nivec4 iTexelFetch1D( isampler2D tex, uint index ) {\n\n\tuint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );\n\n}\n\nvec4 texelFetch1D( sampler2D tex, uint index ) {\n\n\tuint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );\n\n}\n\nvec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {\n\n\treturn\n\t\tbarycoord.x * texelFetch1D( tex, faceIndices.x ) +\n\t\tbarycoord.y * texelFetch1D( tex, faceIndices.y ) +\n\t\tbarycoord.z * texelFetch1D( tex, faceIndices.z );\n\n}\n\nvoid ndcToCameraRay(\n\tvec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,\n\tout vec3 rayOrigin, out vec3 rayDirection\n) {\n\n\t// get camera look direction and near plane for camera clipping\n\tvec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );\n\tvec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );\n\tfloat near = abs( nearVector.z / nearVector.w );\n\n\t// get the camera direction and position from camera matrices\n\tvec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );\n\tvec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );\n\tdirection /= direction.w;\n\tdirection = cameraWorld * direction - origin;\n\n\t// slide the origin along the ray until it sits at the near clip plane position\n\torigin.xyz += direction.xyz * near / dot( direction, lookDirection );\n\n\trayOrigin = origin.xyz;\n\trayDirection = direction.xyz;\n\n}\n",
  dr =
    "\n\nfloat dot2( vec3 v ) {\n\n\treturn dot( v, v );\n\n}\n\n// https://www.shadertoy.com/view/ttfGWl\nvec3 closestPointToTriangle( vec3 p, vec3 v0, vec3 v1, vec3 v2, out vec3 barycoord ) {\n\n    vec3 v10 = v1 - v0;\n    vec3 v21 = v2 - v1;\n    vec3 v02 = v0 - v2;\n\n\tvec3 p0 = p - v0;\n\tvec3 p1 = p - v1;\n\tvec3 p2 = p - v2;\n\n    vec3 nor = cross( v10, v02 );\n\n    // method 2, in barycentric space\n    vec3  q = cross( nor, p0 );\n    float d = 1.0 / dot2( nor );\n    float u = d * dot( q, v02 );\n    float v = d * dot( q, v10 );\n    float w = 1.0 - u - v;\n\n\tif( u < 0.0 ) {\n\n\t\tw = clamp( dot( p2, v02 ) / dot2( v02 ), 0.0, 1.0 );\n\t\tu = 0.0;\n\t\tv = 1.0 - w;\n\n\t} else if( v < 0.0 ) {\n\n\t\tu = clamp( dot( p0, v10 ) / dot2( v10 ), 0.0, 1.0 );\n\t\tv = 0.0;\n\t\tw = 1.0 - u;\n\n\t} else if( w < 0.0 ) {\n\n\t\tv = clamp( dot( p1, v21 ) / dot2( v21 ), 0.0, 1.0 );\n\t\tw = 0.0;\n\t\tu = 1.0-v;\n\n\t}\n\n\tbarycoord = vec3( u, v, w );\n    return u * v1 + v * v2 + w * v0;\n\n}\n\nfloat distanceToTriangles(\n\t// geometry info and triangle range\n\tsampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,\n\n\t// point and cut off range\n\tvec3 point, float closestDistanceSquared,\n\n\t// outputs\n\tinout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord, inout float side, inout vec3 outPoint\n) {\n\n\tbool found = false;\n\tvec3 localBarycoord;\n\tfor ( uint i = offset, l = offset + count; i < l; i ++ ) {\n\n\t\tuvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;\n\t\tvec3 a = texelFetch1D( positionAttr, indices.x ).rgb;\n\t\tvec3 b = texelFetch1D( positionAttr, indices.y ).rgb;\n\t\tvec3 c = texelFetch1D( positionAttr, indices.z ).rgb;\n\n\t\t// get the closest point and barycoord\n\t\tvec3 closestPoint = closestPointToTriangle( point, a, b, c, localBarycoord );\n\t\tvec3 delta = point - closestPoint;\n\t\tfloat sqDist = dot2( delta );\n\t\tif ( sqDist < closestDistanceSquared ) {\n\n\t\t\t// set the output results\n\t\t\tclosestDistanceSquared = sqDist;\n\t\t\tfaceIndices = uvec4( indices.xyz, i );\n\t\t\tfaceNormal = normalize( cross( a - b, b - c ) );\n\t\t\tbarycoord = localBarycoord;\n\t\t\toutPoint = closestPoint;\n\t\t\tside = sign( dot( faceNormal, delta ) );\n\n\t\t}\n\n\t}\n\n\treturn closestDistanceSquared;\n\n}\n\nfloat distanceSqToBounds( vec3 point, vec3 boundsMin, vec3 boundsMax ) {\n\n\tvec3 clampedPoint = clamp( point, boundsMin, boundsMax );\n\tvec3 delta = point - clampedPoint;\n\treturn dot( delta, delta );\n\n}\n\nfloat distanceSqToBVHNodeBoundsPoint( vec3 point, sampler2D bvhBounds, uint currNodeIndex ) {\n\n\tuint cni2 = currNodeIndex * 2u;\n\tvec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;\n\tvec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;\n\treturn distanceSqToBounds( point, boundsMin, boundsMax );\n\n}\n\n// use a macro to hide the fact that we need to expand the struct into separate fields\n#define\tbvhClosestPointToPoint(\t\tbvh,\t\tpoint, faceIndices, faceNormal, barycoord, side, outPoint\t)\t_bvhClosestPointToPoint(\t\tbvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,\t\tpoint, faceIndices, faceNormal, barycoord, side, outPoint\t)\n\nfloat _bvhClosestPointToPoint(\n\t// bvh info\n\tsampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,\n\n\t// point to check\n\tvec3 point,\n\n\t// output variables\n\tinout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,\n\tinout float side, inout vec3 outPoint\n ) {\n\n\t// stack needs to be twice as long as the deepest tree we expect because\n\t// we push both the left and right child onto the stack every traversal\n\tint ptr = 0;\n\tuint stack[ BVH_STACK_DEPTH ];\n\tstack[ 0 ] = 0u;\n\n\tfloat closestDistanceSquared = pow( 100000.0, 2.0 );\n\tbool found = false;\n\twhile ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {\n\n\t\tuint currNodeIndex = stack[ ptr ];\n\t\tptr --;\n\n\t\t// check if we intersect the current bounds\n\t\tfloat boundsHitDistance = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, currNodeIndex );\n\t\tif ( boundsHitDistance > closestDistanceSquared ) {\n\n\t\t\tcontinue;\n\n\t\t}\n\n\t\tuvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;\n\t\tbool isLeaf = bool( boundsInfo.x & 0xffff0000u );\n\t\tif ( isLeaf ) {\n\n\t\t\tuint count = boundsInfo.x & 0x0000ffffu;\n\t\t\tuint offset = boundsInfo.y;\n\t\t\tclosestDistanceSquared = distanceToTriangles(\n\t\t\t\tbvh_position, bvh_index, offset, count, point, closestDistanceSquared,\n\n\t\t\t\t// outputs\n\t\t\t\tfaceIndices, faceNormal, barycoord, side, outPoint\n\t\t\t);\n\n\t\t} else {\n\n\t\t\tuint leftIndex = currNodeIndex + 1u;\n\t\t\tuint splitAxis = boundsInfo.x & 0x0000ffffu;\n\t\t\tuint rightIndex = boundsInfo.y;\n\t\t\tbool leftToRight = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, leftIndex ) < distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, rightIndex );//rayDirection[ splitAxis ] >= 0.0;\n\t\t\tuint c1 = leftToRight ? leftIndex : rightIndex;\n\t\t\tuint c2 = leftToRight ? rightIndex : leftIndex;\n\n\t\t\t// set c2 in the stack so we traverse it later. We need to keep track of a pointer in\n\t\t\t// the stack while we traverse. The second pointer added is the one that will be\n\t\t\t// traversed first\n\t\t\tptr ++;\n\t\t\tstack[ ptr ] = c2;\n\t\t\tptr ++;\n\t\t\tstack[ ptr ] = c1;\n\n\t\t}\n\n\t}\n\n\treturn sqrt( closestDistanceSquared );\n\n}\n",
  fr =
    "\n\n#ifndef TRI_INTERSECT_EPSILON\n#define TRI_INTERSECT_EPSILON 1e-5\n#endif\n\n// Raycasting\nbool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {\n\n\t// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/\n\t// https://tavianator.com/2011/ray_box.html\n\tvec3 invDir = 1.0 / rayDirection;\n\n\t// find intersection distances for each plane\n\tvec3 tMinPlane = invDir * ( boundsMin - rayOrigin );\n\tvec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );\n\n\t// get the min and max distances from each intersection\n\tvec3 tMinHit = min( tMaxPlane, tMinPlane );\n\tvec3 tMaxHit = max( tMaxPlane, tMinPlane );\n\n\t// get the furthest hit distance\n\tvec2 t = max( tMinHit.xx, tMinHit.yz );\n\tfloat t0 = max( t.x, t.y );\n\n\t// get the minimum hit distance\n\tt = min( tMaxHit.xx, tMaxHit.yz );\n\tfloat t1 = min( t.x, t.y );\n\n\t// set distance to 0.0 if the ray starts inside the box\n\tdist = max( t0, 0.0 );\n\n\treturn t1 >= dist;\n\n}\n\nbool intersectsTriangle(\n\tvec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,\n\tout vec3 barycoord, out vec3 norm, out float dist, out float side\n) {\n\n\t// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d\n\tvec3 edge1 = b - a;\n\tvec3 edge2 = c - a;\n\tnorm = cross( edge1, edge2 );\n\n\tfloat det = - dot( rayDirection, norm );\n\tfloat invdet = 1.0 / det;\n\n\tvec3 AO = rayOrigin - a;\n\tvec3 DAO = cross( AO, rayDirection );\n\n\tvec4 uvt;\n\tuvt.x = dot( edge2, DAO ) * invdet;\n\tuvt.y = - dot( edge1, DAO ) * invdet;\n\tuvt.z = dot( AO, norm ) * invdet;\n\tuvt.w = 1.0 - uvt.x - uvt.y;\n\n\t// set the hit information\n\tbarycoord = uvt.wxy; // arranged in A, B, C order\n\tdist = uvt.z;\n\tside = sign( det );\n\tnorm = side * normalize( norm );\n\n\t// add an epsilon to avoid misses between triangles\n\tuvt += vec4( TRI_INTERSECT_EPSILON );\n\n\treturn all( greaterThanEqual( uvt, vec4( 0.0 ) ) );\n\n}\n\nbool intersectTriangles(\n\t// geometry info and triangle range\n\tsampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,\n\n\t// ray\n\tvec3 rayOrigin, vec3 rayDirection,\n\n\t// outputs\n\tinout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,\n\tinout float side, inout float dist\n) {\n\n\tbool found = false;\n\tvec3 localBarycoord, localNormal;\n\tfloat localDist, localSide;\n\tfor ( uint i = offset, l = offset + count; i < l; i ++ ) {\n\n\t\tuvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;\n\t\tvec3 a = texelFetch1D( positionAttr, indices.x ).rgb;\n\t\tvec3 b = texelFetch1D( positionAttr, indices.y ).rgb;\n\t\tvec3 c = texelFetch1D( positionAttr, indices.z ).rgb;\n\n\t\tif (\n\t\t\tintersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )\n\t\t\t&& localDist < minDistance\n\t\t) {\n\n\t\t\tfound = true;\n\t\t\tminDistance = localDist;\n\n\t\t\tfaceIndices = uvec4( indices.xyz, i );\n\t\t\tfaceNormal = localNormal;\n\n\t\t\tside = localSide;\n\t\t\tbarycoord = localBarycoord;\n\t\t\tdist = localDist;\n\n\t\t}\n\n\t}\n\n\treturn found;\n\n}\n\nbool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {\n\n\tuint cni2 = currNodeIndex * 2u;\n\tvec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;\n\tvec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;\n\treturn intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );\n\n}\n\n// use a macro to hide the fact that we need to expand the struct into separate fields\n#define\tbvhIntersectFirstHit(\t\tbvh,\t\trayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist\t)\t_bvhIntersectFirstHit(\t\tbvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,\t\trayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist\t)\n\nbool _bvhIntersectFirstHit(\n\t// bvh info\n\tsampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,\n\n\t// ray\n\tvec3 rayOrigin, vec3 rayDirection,\n\n\t// output variables split into separate variables due to output precision\n\tinout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,\n\tinout float side, inout float dist\n) {\n\n\t// stack needs to be twice as long as the deepest tree we expect because\n\t// we push both the left and right child onto the stack every traversal\n\tint ptr = 0;\n\tuint stack[ BVH_STACK_DEPTH ];\n\tstack[ 0 ] = 0u;\n\n\tfloat triangleDistance = INFINITY;\n\tbool found = false;\n\twhile ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {\n\n\t\tuint currNodeIndex = stack[ ptr ];\n\t\tptr --;\n\n\t\t// check if we intersect the current bounds\n\t\tfloat boundsHitDistance;\n\t\tif (\n\t\t\t! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )\n\t\t\t|| boundsHitDistance > triangleDistance\n\t\t) {\n\n\t\t\tcontinue;\n\n\t\t}\n\n\t\tuvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;\n\t\tbool isLeaf = bool( boundsInfo.x & 0xffff0000u );\n\n\t\tif ( isLeaf ) {\n\n\t\t\tuint count = boundsInfo.x & 0x0000ffffu;\n\t\t\tuint offset = boundsInfo.y;\n\n\t\t\tfound = intersectTriangles(\n\t\t\t\tbvh_position, bvh_index, offset, count,\n\t\t\t\trayOrigin, rayDirection, triangleDistance,\n\t\t\t\tfaceIndices, faceNormal, barycoord, side, dist\n\t\t\t) || found;\n\n\t\t} else {\n\n\t\t\tuint leftIndex = currNodeIndex + 1u;\n\t\t\tuint splitAxis = boundsInfo.x & 0x0000ffffu;\n\t\t\tuint rightIndex = boundsInfo.y;\n\n\t\t\tbool leftToRight = rayDirection[ splitAxis ] >= 0.0;\n\t\t\tuint c1 = leftToRight ? leftIndex : rightIndex;\n\t\t\tuint c2 = leftToRight ? rightIndex : leftIndex;\n\n\t\t\t// set c2 in the stack so we traverse it later. We need to keep track of a pointer in\n\t\t\t// the stack while we traverse. The second pointer added is the one that will be\n\t\t\t// traversed first\n\t\t\tptr ++;\n\t\t\tstack[ ptr ] = c2;\n\n\t\t\tptr ++;\n\t\t\tstack[ ptr ] = c1;\n\n\t\t}\n\n\t}\n\n\treturn found;\n\n}\n",
  hr =
    "\nstruct BVH {\n\n\tusampler2D index;\n\tsampler2D position;\n\n\tsampler2D bvhBounds;\n\tusampler2D bvhContents;\n\n};\n";
var pr = Object.freeze({
  __proto__: null,
  common_functions: lr,
  bvh_distance_functions: dr,
  bvh_ray_functions: fr,
  bvh_struct_definitions: hr,
});
const yr = hr,
  mr = dr,
  xr = `\n\t${lr}\n\t${fr}\n`;

// export {
//   C as AVERAGE,
//   pr as BVHShaderGLSL,
//   k as CENTER,
//   O as CONTAINED,
//   Et as ExtendedTriangle,
//   Gn as FloatVertexAttributeTexture,
//   V as INTERSECTED,
//   Wn as IntVertexAttributeTexture,
//   wn as MeshBVH,
//   Tn as MeshBVHHelper,
//   Xn as MeshBVHUniformStruct,
//   q as NOT_INTERSECTED,
//   Nt as OrientedBox,
//   H as SAH,
//   ur as StaticGeometryGenerator,
//   Rn as UIntVertexAttributeTexture,
//   On as VertexAttributeTexture,
//   Cn as acceleratedRaycast,
//   Hn as computeBoundsTree,
//   qn as disposeBoundsTree,
//   Dn as estimateMemoryInBytes,
//   Sn as getBVHExtremes,
//   zn as getJSONStructure,
//   he as getTriangleHitPointInfo,
//   mr as shaderDistanceFunction,
//   xr as shaderIntersectFunction,
//   yr as shaderStructs,
//   Fn as validateBounds,
// };
// var AVERAGE = C;
// var BVHShaderGLSL = pr;
// var CENTER = k;
// var CONTAINED = O;
// var ExtendedTriangle = Et;
// var FloatVertexAttributeTexture = Gn;
// var INTERSECTED = V;
// var IntVertexAttributeTexture = Wn;
// var MeshBVH = wn;
// var MeshBVHHelper = Tn;
// var MeshBVHUniformStruct = Xn;
// var NOT_INTERSECTED = q;
// var OrientedBox = Nt;
// var SAH = H;
// var StaticGeometryGenerator = ur;
// var UIntVertexAttributeTexture = Rn;
// var VertexAttributeTexture = On;
// var acceleratedRaycast = Cn;
// var computeBoundsTree = Hn;
// var disposeBoundsTree = qn;
// var estimateMemoryInBytes = Dn;
// var getBVHExtremes = Sn;
// var getJSONStructure = zn;
// var getTriangleHitPointInfo = he;
// var shaderDistanceFunction = mr;
// var shaderIntersectFunction = xr;
// var shaderStructs = yr;
// var validateBounds = Fn;
// export default null;
//# sourceMappingURL=/sm/bba946060edaa7ce8f1616a9ba0a6131c8b8b42745e8e03ea104b87395756873.map
