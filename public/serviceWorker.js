(function () {
  /*
  
      Copyright The Closure Library Authors.
      SPDX-License-Identifier: Apache-2.0
     */
  "use strict";
  var h;
  function aa(a) {
    var b = 0;
    return function () {
      return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
    };
  }
  function l(a) {
    var b =
      "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : { next: aa(a) };
  }
  function ba(a) {
    a = [
      "object" == typeof window && window,
      "object" == typeof self && self,
      "object" == typeof globalThis && globalThis,
      a,
    ];
    for (var b = 0; b < a.length; ++b) {
      var c = a[b];
      if (c && c.Math == Math) return c;
    }
    return globalThis;
  }  var n = ba(this),
    ca =
      "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, b, c) {
            a != Array.prototype && a != Object.prototype && (a[b] = c.value);
          };
  function da(a, b) {
    if (b) {
      var c = n;
      a = a.split(".");
      for (var d = 0; d < a.length - 1; d++) {
        var e = a[d];
        e in c || (c[e] = {});
        c = c[e];
      }
      a = a[a.length - 1];
      d = c[a];
      b = b(d);
      b != d &&
        null != b &&
        ca(c, a, { configurable: !0, writable: !0, value: b });
    }
  }
  da("Promise", function (a) {
    function b(f) {
      this.b = 0;
      this.h = void 0;
      this.a = [];
      var k = this.c();
      try {
        f(k.resolve, k.reject);
      } catch (m) {
        k.reject(m);
      }
    }
    function c() {
      this.a = null;
    }
    function d(f) {
      return f instanceof b
        ? f
        : new b(function (k) {
            k(f);
          });
    }
    if (a) return a;
    c.prototype.b = function (f) {
      if (null == this.a) {
        this.a = [];
        var k = this;
        this.c(function () {
          k.h();
        });
      }
      this.a.push(f);
    };
    var e = n.setTimeout;
    c.prototype.c = function (f) {
      e(f, 0);
    };
    c.prototype.h = function () {
      for (; this.a && this.a.length; ) {
        var f = this.a;
        this.a = [];
        for (var k = 0; k < f.length; ++k) {
          var m = f[k];
          f[k] = null;
          try {
            m();
          } catch (q) {
            this.f(q);
          }
        }
      }
      this.a = null;
    };
    c.prototype.f = function (f) {
      this.c(function () {
        throw f;
      });
    };
    b.prototype.c = function () {
      function f(q) {
        return function (x) {
          m || ((m = !0), q.call(k, x));
        };
      }
      var k = this,
        m = !1;
      return { resolve: f(this.A), reject: f(this.f) };
    };
    b.prototype.A = function (f) {
      if (f === this)
        this.f(new TypeError("A Promise cannot resolve to itself"));
      else if (f instanceof b) this.F(f);
      else {
        a: switch (typeof f) {
          case "object":
            var k = null != f;
            break a;
          case "function":
            k = !0;
            break a;
          default:
            k = !1;
        }
        k ? this.w(f) : this.i(f);
      }
    };
    b.prototype.w = function (f) {
      var k = void 0;
      try {
        k = f.then;
      } catch (m) {
        this.f(m);
        return;
      }
      "function" == typeof k ? this.G(k, f) : this.i(f);
    };
    b.prototype.f = function (f) {
      this.l(2, f);
    };
    b.prototype.i = function (f) {
      this.l(1, f);
    };
    b.prototype.l = function (f, k) {
      if (0 != this.b)
        throw Error(
          "Cannot settle(" +
            f +
            ", " +
            k +
            "): Promise already settled in state" +
            this.b
        );
      this.b = f;
      this.h = k;
      this.m();
    };
    b.prototype.m = function () {
      if (null != this.a) {
        for (var f = 0; f < this.a.length; ++f) g.b(this.a[f]);
        this.a = null;
      }
    };
    var g = new c();
    b.prototype.F = function (f) {
      var k = this.c();
      f.s(k.resolve, k.reject);
    };
    b.prototype.G = function (f, k) {
      var m = this.c();
      try {
        f.call(k, m.resolve, m.reject);
      } catch (q) {
        m.reject(q);
      }
    };
    b.prototype.then = function (f, k) {
      function m(D, G) {
        return "function" == typeof D
          ? function (R) {
              try {
                q(D(R));
              } catch (E) {
                x(E);
              }
            }
          : G;
      }
      var q,
        x,
        O = new b(function (D, G) {
          q = D;
          x = G;
        });
      this.s(m(f, q), m(k, x));
      return O;
    };
    b.prototype.catch = function (f) {
      return this.then(void 0, f);
    };
    b.prototype.s = function (f, k) {
      function m() {
        switch (q.b) {
          case 1:
            f(q.h);
            break;
          case 2:
            k(q.h);
            break;
          default:
            throw Error("Unexpected state: " + q.b);
        }
      }
      var q = this;
      null == this.a ? g.b(m) : this.a.push(m);
    };
    b.resolve = d;
    b.reject = function (f) {
      return new b(function (k, m) {
        m(f);
      });
    };
    b.race = function (f) {
      return new b(function (k, m) {
        for (var q = l(f), x = q.next(); !x.done; x = q.next())
          d(x.value).s(k, m);
      });
    };
    b.all = function (f) {
      var k = l(f),
        m = k.next();
      return m.done
        ? d([])
        : new b(function (q, x) {
            function O(R) {
              return function (E) {
                D[R] = E;
                G--;
                0 == G && q(D);
              };
            }
            var D = [],
              G = 0;
            do
              D.push(void 0),
                G++,
                d(m.value).s(O(D.length - 1), x),
                (m = k.next());
            while (!m.done);
          });
    };
    return b;
  });
  let ea = () => {
    ea = () => {};
    n.Symbol || (n.Symbol = fa);
  };
  
  function ha(a, b) {    this.a = a;
    ca(this, "description", { configurable: !0, writable: !0, value: b });
  }
  ha.prototype.toString = function () {
    return this.a;
  };
  var fa = (function () {
    function a(c) {
      if (this instanceof a) throw new TypeError("Symbol is not a constructor");
      return new ha("jscomp_symbol_" + (c || "") + "_" + b++, c);
    }
    var b = 0;
    return a;
  })();
  let ia = () => {
    ea();
    var a = n.Symbol.iterator;
    a || (a = n.Symbol.iterator = n.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[a] &&
      ca(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
          return ja(aa(this));
        },
      });
    ia = function () {};
  }
  function ja(a) {
    ia();
    a = { next: a };
    a[n.Symbol.iterator] = function () {
      return this;
    };
    return a;
  }
  function ka(a) {
    if (!(a instanceof Object))
      throw new TypeError("Iterator result " + a + " is not an object");
  }
  function la() {
    this.l = !1;
    this.h = null;
    this.b = void 0;
    this.a = 1;
    this.i = this.f = 0;
    this.m = this.c = null;
  }
  function ma(a) {
    if (a.l) throw new TypeError("Generator is already running");
    a.l = !0;
  }
  h = la.prototype;
  h.u = function (a) {
    this.b = a;
  };
  function na(a, b) {
    a.c = { D: b, v: !0 };
    a.a = a.f || a.i;
  }
  h.return = function (a) {
    this.c = { return: a };
    this.a = this.i;
  };
  h.fa = function (a) {
    this.c = { j: a };
    this.a = this.i;
  };
  function p(a, b, c) {
    a.a = c;
    return { value: b };
  }
  h.cc = function (a, b) {
    a = l(a);
    var c = a.next();
    ka(c);
    if (c.done) (this.b = c.value), (this.a = b);
    else return (this.h = a), p(this, c.value, b);
  };
  h.j = function (a) {
    this.a = a;
  };
  h.ya = function (a) {
    this.f = 0;
    this.i = a || 0;
  };
  function oa(a, b) {
    a.a = b;
    a.f = 0;
  }
  function pa(a) {
    a.f = 0;
    a.c = null;
  }
  h.S = function (a, b, c) {
    c ? (this.m[c] = this.c) : (this.m = [this.c]);
    this.f = a || 0;
    this.i = b || 0;
  };
  h.ha = function (a, b) {
    let spliced = this.m.splice(b || 0)[0];
    this.c = this.c || spliced;
    b = this.c;
    
    if (b) {
      if (b.v) {
        this.a = this.f || this.i;
      } else if (void 0 !== b.j && this.i < b.j) {
        this.a = b.j;
        this.c = null;
      } else {
        this.a = this.i;
      }
    } else {
      this.a = a;
    }
  };  h.W = function (a) {
    return new qa(a);
  };
  function qa(a) {
    this.b = a;
    this.a = [];
    for (var b in a) this.a.push(b);
    this.a.reverse();
  }
  qa.prototype.c = function () {
    for (; 0 < this.a.length; ) {
      var a = this.a.pop();
      if (a in this.b) return a;
    }
    return null;
  };
  function ra(a) {
    this.a = new la();
    this.b = a;
  }
  function sa(a, b) {
    ma(a.a);
    var c = a.a.h;
    if (c)
      return ta(
        a,
        "return" in c
          ? c["return"]
          : function (d) {
              return { value: d, done: !0 };
            },
        b,
        a.a.return
      );
    a.a.return(b);
    return r(a);
  }
  function ta(a, b, c, d) {
    try {
      var e = b.call(a.a.h, c);
      ka(e);
      if (!e.done) return (a.a.l = !1), e;
      var g = e.value;
    } catch (f) {
      return (a.a.h = null), na(a.a, f), r(a);
    }
    a.a.h = null;
    d.call(a.a, g);
    return r(a);
  }
  function r(a) {
    for (; a.a.a; )
      try {
        var b = a.b(a.a);
        if (b) return (a.a.l = !1), { value: b.value, done: !1 };
      } catch (c) {
        (a.a.b = void 0), na(a.a, c);
      }
    a.a.l = !1;
    if (a.a.c) {
      b = a.a.c;
      a.a.c = null;
      if (b.v) throw b.D;
      return { value: b.return, done: !0 };
    }
    return { value: void 0, done: !0 };
  }
  function ua(a) {
    this.next = function (b) {
      ma(a.a);
      a.a.h ? (b = ta(a, a.a.h.next, b, a.a.u)) : (a.a.u(b), (b = r(a)));
      return b;
    };
    this.throw = function (b) {
      ma(a.a);
      a.a.h ? (b = ta(a, a.a.h["throw"], b, a.a.u)) : (na(a.a, b), (b = r(a)));
      return b;
    };
    this.return = function (b) {
      return sa(a, b);
    };
    ia();
    this[Symbol.iterator] = function () {
      return this;
    };
  }
  function va(a) {
    function b(d) {
      return a.next(d);
    }
    function c(d) {
      return a.throw(d);
    }
    return new Promise(function (d, e) {
      function g(f) {
        f.done ? d(f.value) : Promise.resolve(f.value).then(b, c).then(g, e);
      }
      g(a.next());
    });
  }
  function t(a) {
    return va(new ua(new ra(a)));
  }
  var wa = this || self;
  function xa(a) {
    var b = typeof a;
    if ("object" == b)
      if (a) {
        if (a instanceof Array) return "array";
        if (a instanceof Object) return b;
        var c = Object.prototype.toString.call(a);
        if ("[object Window]" == c) return "object";
        if (
          "[object Array]" == c ||
          ("number" == typeof a.length &&
            "undefined" != typeof a.splice &&
            "undefined" != typeof Object.prototype.propertyIsEnumerable.call(a, "splice") &&
            !Object.prototype.propertyIsEnumerable.call(a, "splice"))
        )
          return "array";
        if (
          "[object Function]" == c ||
          ("undefined" != typeof a.call &&
            "undefined" != typeof Object.prototype.propertyIsEnumerable.call(a, "call") &&
            !Object.prototype.propertyIsEnumerable.call(a, "call"))
        )
          return "function";
      } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b;
  }  function ya(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.La = b.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.I = function (d, e, g) {
      for (
        var f = Array(arguments.length - 2), k = 2;
        k < arguments.length;
        k++
      )
        f[k - 2] = arguments[k];
      return b.prototype[e].apply(d, f);
    };
  }
  var za = Array.prototype.map
    ? function (a, b) {
        return Array.prototype.map.call(a, b, void 0);
      }
    : function (a, b) {
        for (
          var c = a.length,
            d = Array(c),
            e = "string" === typeof a ? a.split("") : a,
            g = 0;
          g < c;
          g++
        )
          g in e && (d[g] = b.call(void 0, e[g], g, a));
        return d;
      };
  function Aa(a, b, c) {
    return 2 >= arguments.length
      ? Array.prototype.slice.call(a, b)
      : Array.prototype.slice.call(a, b, c);
  }
  function Ba(a) {
    if (8192 >= a.length) return String.fromCharCode.apply(null, a);
    for (var b = "", c = 0; c < a.length; c += 8192)
      b += String.fromCharCode.apply(null, Aa(a, c, c + 8192));
    return b;
  }
  var Ca = {},
    u = null;
  function Da(a, b) {
    void 0 === b && (b = 0);
    Ea();
    b = Ca[b];
    for (var c = [], d = 0; d < a.length; d += 3) {
      var e = a[d],
        g = d + 1 < a.length,
        f = g ? a[d + 1] : 0,
        k = d + 2 < a.length,
        m = k ? a[d + 2] : 0,
        q = e >> 2;
      e = ((e & 3) << 4) | (f >> 4);
      f = ((f & 15) << 2) | (m >> 6);
      m &= 63;
      k || ((m = 64), g || (f = 64));
      c.push(b[q], b[e], b[f] || "", b[m] || "");
    }
    return c.join("");
  }
  function Fa(a) {
    var b = a.length,
      c = (3 * b) / 4;
    c % 3
      ? (c = Math.floor(c))
      : -1 != "=.".indexOf(a[b - 1]) &&
        (c = -1 != "=.".indexOf(a[b - 2]) ? c - 2 : c - 1);
    var d = new Uint8Array(c),
      e = 0;
    Ga(a, function (g) {
      d[e++] = g;
    });
    return d.subarray(0, e);
  }
  function Ga(a, b) {
    function c(m) {
      for (; d < a.length; ) {
        var q = a.charAt(d++),
          x = u[q];
        if (null != x) return x;
        if (!/^[\s\xa0]*$/.test(q))
          throw Error("Unknown base64 encoding at char: " + q);
      }
      return m;
    }
    Ea();
    for (var d = 0; ; ) {
      var e = c(-1),
        g = c(0),
        f = c(64),
        k = c(64);
      if (64 === k && -1 === e) break;
      b((e << 2) | (g >> 4));
      64 != f &&
        (b(((g << 4) & 240) | (f >> 2)), 64 != k && b(((f << 6) & 192) | k));
    }
  }
  function Ea() {
    if (!u) {
      u = {};
      for (
        var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
            ""
          ),
          b = ["+/=", "+/", "-_=", "-_.", "-_"],
          c = 0;
        5 > c;
        c++
      ) {
        var d = a.concat(b[c].split(""));
        Ca[c] = d;
        for (var e = 0; e < d.length; e++) {
          var g = d[e];
          void 0 === u[g] && (u[g] = e);
        }
      }
    }
  }
  var v = 0,
    w = 0;
  function Ha(a) {
    var b = a >>> 0;
    a = Math.floor((a - b) / 4294967296) >>> 0;
    v = b;
    w = a;
  }
  function y(a) {
    var b = 0 > a;
    a = Math.abs(a);
    var c = a >>> 0;
    a = Math.floor((a - c) / 4294967296);
    a >>>= 0;
    b &&
      ((a = ~a >>> 0),
      (c = (~c >>> 0) + 1),
      4294967295 < c && ((c = 0), a++, 4294967295 < a && (a = 0)));
    v = c;
    w = a;
  }
  function Ia(a) {
    var b = 0 > a;
    a = 2 * Math.abs(a);
    Ha(a);
    a = v;
    var c = w;
    b &&
      (0 == a
        ? 0 == c
          ? (c = a = 4294967295)
          : (c--, (a = 4294967295))
        : a--);
    v = a;
    w = c;
  }
  function Ja(a) {
    var b = 0 > a ? 1 : 0;
    a = b ? -a : a;
    if (0 === a) 0 < 1 / a ? (v = w = 0) : ((w = 0), (v = 2147483648));
    else if (isNaN(a)) (w = 0), (v = 2147483647);
    else if (3.4028234663852886e38 < a)
      (w = 0), (v = ((b << 31) | 2139095040) >>> 0);
    else if (1.1754943508222875e-38 > a)
      (a = Math.round(a / Math.pow(2, -149))),
        (w = 0),
        (v = ((b << 31) | a) >>> 0);
    else {
      var c = Math.floor(Math.log(a) / Math.LN2);
      a *= Math.pow(2, -c);
      a = Math.round(8388608 * a) & 8388607;
      w = 0;
      v = ((b << 31) | ((c + 127) << 23) | a) >>> 0;
    }
  }
  function z(a) {
    var b = a.charCodeAt(4),
      c = a.charCodeAt(5),
      d = a.charCodeAt(6),
      e = a.charCodeAt(7);
    v =
      (a.charCodeAt(0) +
        (a.charCodeAt(1) << 8) +
        (a.charCodeAt(2) << 16) +
        (a.charCodeAt(3) << 24)) >>>
      0;
    w = (b + (c << 8) + (d << 16) + (e << 24)) >>> 0;
  }
  function Ka(a, b, c) {
    var d = b >> 31;
    c((a << 1) ^ d, ((b << 1) | (a >>> 31)) ^ d);
  }
  function Ma(a) {
    function b(f, k) {
      for (var m = 0; 8 > m && (1 !== f || 0 < k); m++)
        (k = f * e[m] + k), (e[m] = k & 255), (k >>>= 8);
    }
    function c() {
      for (var f = 0; 8 > f; f++) e[f] = ~e[f] & 255;
    }
    var d = !1;
    "-" === a[0] && ((d = !0), (a = a.slice(1)));
    for (var e = [0, 0, 0, 0, 0, 0, 0, 0], g = 0; g < a.length; g++)
      b(10, a.charCodeAt(g) - 48);
    d && (c(), b(1, 1));
    return Ba(e);
  }
  function A(a, b) {
    this.a = a;
    this.b = b;
  }
  function Na(a) {
    return new A(((a.a >>> 1) | ((a.b & 1) << 31)) >>> 0, (a.b >>> 1) >>> 0);
  }
  function Oa(a) {
    return new A((a.a << 1) >>> 0, ((a.b << 1) | (a.a >>> 31)) >>> 0);
  }
  h = A.prototype;
  h.ia = function () {
    return !!(this.a & 1);
  };
  h.add = function (a) {
    return new A(
      (((this.a + a.a) & 4294967295) >>> 0) >>> 0,
      ((((this.b + a.b) & 4294967295) >>> 0) +
        (4294967296 <= this.a + a.a ? 1 : 0)) >>>
        0
    );
  };
  h.sub = function (a) {
    return new A(
      (((this.a - a.a) & 4294967295) >>> 0) >>> 0,
      ((((this.b - a.b) & 4294967295) >>> 0) - (0 > this.a - a.a ? 1 : 0)) >>> 0
    );
  };
  function Pa(a) {
    var b = a & 65535,
      c = a >>> 16;
    a = 10 * b + 65536 * ((0 * b) & 65535) + 65536 * ((10 * c) & 65535);
    for (b = 0 * c + ((0 * b) >>> 16) + ((10 * c) >>> 16); 4294967296 <= a; )
      (a -= 4294967296), (b += 1);
    return new A(a >>> 0, b >>> 0);
  }
  h.toString = function () {
    for (var a = "", b = this; 0 != b.a || 0 != b.b; ) {
      var c = new A(0, 0);
      b = new A(b.a, b.b);
      for (var d = new A(10, 0), e = new A(1, 0); !(d.b & 2147483648); )
        (d = Oa(d)), (e = Oa(e));
      for (; 0 != e.a || 0 != e.b; )
        0 >=
          (d.b < b.b || (d.b == b.b && d.a < b.a)
            ? -1
            : d.b == b.b && d.a == b.a
            ? 0
            : 1) && ((c = c.add(e)), (b = b.sub(d))),
          (d = Na(d)),
          (e = Na(e));
      c = [c, b];
      b = c[0];
      a = c[1].a + a;
    }
    "" == a && (a = "0");
    return a;
  };
  function B(a) {
    for (var b = new A(0, 0), c = new A(0, 0), d = 0; d < a.length; d++) {
      if ("0" > a[d] || "9" < a[d]) return null;
      c.a = parseInt(a[d], 10);
      var e = Pa(b.a);
      b = Pa(b.b);
      b.b = b.a;
      b.a = 0;
      b = e.add(b).add(c);
    }
    return b;
  }
  h.ea = function () {
    return new A(this.a, this.b);
  };
  function C(a, b) {
    this.a = a;
    this.b = b;
  }
  C.prototype.add = function (a) {
    return new C(
      (((this.a + a.a) & 4294967295) >>> 0) >>> 0,
      ((((this.b + a.b) & 4294967295) >>> 0) +
        (4294967296 <= this.a + a.a ? 1 : 0)) >>>
        0
    );
  };
  C.prototype.sub = function (a) {
    return new C(
      (((this.a - a.a) & 4294967295) >>> 0) >>> 0,
      ((((this.b - a.b) & 4294967295) >>> 0) - (0 > this.a - a.a ? 1 : 0)) >>> 0
    );
  };
  C.prototype.c = function () {
    return new C(this.a, this.b);
  };
  C.prototype.toString = function () {
    var a = 0 != (this.b & 2147483648),
      b = new A(this.a, this.b);
    a && (b = new A(0, 0).sub(b));
    return (a ? "-" : "") + b.toString();
  };
  function Qa(a) {
    var b = 0 < a.length && "-" == a[0];
    b && (a = a.substring(1));
    a = B(a);
    if (null === a) return null;
    b && (a = new A(0, 0).sub(a));
    return new C(a.a, a.b);
  }
  function Ra() {
    this.a = [];
  }
  h = Ra.prototype;
  h.length = function () {
    return this.a.length;
  };
  function Sa(a) {
    var b = a.a;
    a.a = [];
    return b;
  }
  function F(a, b, c) {
    for (; 0 < c || 127 < b; )
      a.a.push((b & 127) | 128),
        (b = ((b >>> 7) | (c << 25)) >>> 0),
        (c >>>= 7);
    a.a.push(b);
  }
  function I(a, b, c) {
    J(a, b);
    J(a, c);
  }
  function K(a, b) {
    for (; 127 < b; ) a.a.push((b & 127) | 128), (b >>>= 7);
    a.a.push(b);
  }
  function L(a, b) {
    if (0 <= b) K(a, b);
    else {
      for (var c = 0; 9 > c; c++) a.a.push((b & 127) | 128), (b >>= 7);
      a.a.push(1);
    }
  }
  function Ta(a, b) {
    K(a, ((b << 1) ^ (b >> 31)) >>> 0);
  }
  function M(a, b) {
    z(b);
    Ka(v, w, function (c, d) {
      F(a, c >>> 0, d >>> 0);
    });
  }
  h.bc = function (a) {
    this.a.push((a >>> 0) & 255);
  };
  h.ac = function (a) {
    this.a.push((a >>> 0) & 255);
    this.a.push((a >>> 8) & 255);
  };
  function J(a, b) {
    a.a.push((b >>> 0) & 255);
    a.a.push((b >>> 8) & 255);
    a.a.push((b >>> 16) & 255);
    a.a.push((b >>> 24) & 255);
  }
  function Ua(a, b) {
    Ha(b);
    J(a, v);
    J(a, w);
  }
  h.Qa = function (a) {
    this.a.push((a >>> 0) & 255);
  };
  h.Pa = function (a) {
    this.a.push((a >>> 0) & 255);
    this.a.push((a >>> 8) & 255);
  };
  function Va(a, b) {
    a.a.push((b >>> 0) & 255);
    a.a.push((b >>> 8) & 255);
    a.a.push((b >>> 16) & 255);
    a.a.push((b >>> 24) & 255);
  }
  function Wa(a, b) {
    var c = b;
    var isNegative = 0 > c;
    b = isNegative ? 1 : 0;
    c = isNegative ? -c : c;
    if (0 === c) (w = 0 < 1 / c ? 0 : 2147483648), (v = 0);
    else if (isNaN(c)) (w = 2147483647), (v = 4294967295);
    else if (1.7976931348623157e308 < c)
      (w = ((b << 31) | 2146435072) >>> 0), (v = 0);
    else if (2.2250738585072014e-308 > c)
      (c /= Math.pow(2, -1074)),
        (w = ((b << 31) | (c / 4294967296)) >>> 0),
        (v = c >>> 0);
    else {
      var d = c,
        e = 0;
      if (2 <= d) for (; 2 <= d && 1023 > e; ) e++, (d /= 2);
      else for (; 1 > d && -1022 < e; ) (d *= 2), e--;
      c *= Math.pow(2, -e);
      w = ((b << 31) | ((e + 1023) << 20) | ((1048576 * c) & 1048575)) >>> 0;
      v = (4503599627370496 * c) >>> 0;
    }
    J(a, v);
    J(a, w);
  }  h.aa = function (a) {
    this.a.push.apply(this.a, a);
  };
  function Xa(a, b) {
    z(b);
    J(a, v);
    J(a, w);
  }
  function Ya() {
    this.c = [];
    this.b = 0;
    this.a = new Ra();
    this.f = [];
  }
  function Za(a, b) {
    var c = Sa(a.a);
    a.c.push(c);
    a.c.push(b);
    a.b += c.length + b.length;
  }
  function N(a, b) {
    P(a, b, 2);
    b = Sa(a.a);
    a.c.push(b);
    a.b += b.length;
    b.push(a.b);
    return b;
  }
  function Q(a, b) {
    var c = b.pop();
    for (c = a.b + a.a.length() - c; 127 < c; )
      b.push((c & 127) | 128), (c >>>= 7), a.b++;
    b.push(c);
    a.b++;
  }
  h = Ya.prototype;
  h.ja = function (a, b, c) {
    null != a && null != b && null != c && Za(this, a.subarray(b, c));
  };
  h.ba = function () {
    this.c = [];
    Sa(this.a);
    this.b = 0;
    this.f = [];
  };
  function $a(a) {
    for (
      var b = new Uint8Array(a.b + a.a.length()),
        c = a.c,
        d = c.length,
        e = 0,
        g = 0;
      g < d;
      g++
    ) {
      var f = c[g];
      b.set(f, e);
      e += f.length;
    }
    c = Sa(a.a);
    b.set(c, e);
    a.c = [b];
    return b;
  }
  h.Y = function (a) {
    return Da($a(this), a);
  };
  h.J = function (a) {
    this.f.push(N(this, a));
  };
  h.R = function () {
    Q(this, this.f.pop());
  };
  function P(a, b, c) {
    K(a.a, 8 * b + c);
  }
  h.Na = function (a, b, c) {
    switch (a) {
      case 1:
        null != c && (P(this, b, 1), Wa(this.a, c));
        break;
      case 2:
        null != c && (P(this, b, 5), (a = this.a), Ja(c), J(a, v));
        break;
      case 3:
        null != c &&
          null != c &&
          (P(this, b, 0), (a = this.a), y(c), F(a, v, w));
        break;
      case 4:
        null != c &&
          null != c &&
          (P(this, b, 0), (a = this.a), y(c), F(a, v, w));
        break;
      case 5:
        null != c && ab(this, b, c);
        break;
      case 6:
        null != c && (P(this, b, 1), Ua(this.a, c));
        break;
      case 7:
        null != c && (P(this, b, 5), J(this.a, c));
        break;
      case 8:
        S(this, b, c);
        break;
      case 9:
        T(this, b, c);
        break;
      case 12:
        bb(this, b, c);
        break;
      case 13:
        null != c && cb(this, b, c);
        break;
      case 14:
        db(this, b, c);
        break;
      case 15:
        null != c && (P(this, b, 5), Va(this.a, c));
        break;
      case 16:
        null != c && (P(this, b, 1), (a = this.a), y(c), I(a, v, w));
        break;
      case 17:
        null != c && null != c && (P(this, b, 0), Ta(this.a, c));
        break;
      case 18:
        null != c &&
          null != c &&
          (P(this, b, 0), (a = this.a), Ia(c), F(a, v, w));
        break;
      case 30:
        null != c && (P(this, b, 1), Xa(this.a, c));
        break;
      case 31:
        null != c && (P(this, b, 0), (a = this.a), z(c), F(a, v, w));
    }
  };
  function cb(a, b, c) {
    null != c && (P(a, b, 0), K(a.a, c));
  }
  function ab(a, b, c) {
    null != c && (P(a, b, 0), L(a.a, c));
  }
  h.$b = function (a, b) {
    null != b && null != b && (P(this, a, 0), M(this.a, b));
  };
  h.Zb = function (a, b) {
    null != b && null != b && (P(this, a, 0), M(this.a, Ma(b)));
  };
  function S(a, b, c) {
    null != c && (P(a, b, 0), a.a.a.push(c ? 1 : 0));
  }
  function db(a, b, c) {
    null != c && (P(a, b, 0), L(a.a, c));
  }
  function T(a, b, c) {
    if (null != c) {
      b = N(a, b);
      for (var d = a.a, e = 0; e < c.length; e++) {
        var g = c.charCodeAt(e);
        if (128 > g) d.a.push(g);
        else if (2048 > g) d.a.push((g >> 6) | 192), d.a.push((g & 63) | 128);
        else if (65536 > g)
          if (55296 <= g && 56319 >= g && e + 1 < c.length) {
            var f = c.charCodeAt(e + 1);
            56320 <= f &&
              57343 >= f &&
              ((g = 1024 * (g - 55296) + f - 56320 + 65536),
              d.a.push((g >> 18) | 240),
              d.a.push(((g >> 12) & 63) | 128),
              d.a.push(((g >> 6) & 63) | 128),
              d.a.push((g & 63) | 128),
              e++);
          } else
            d.a.push((g >> 12) | 224),
              d.a.push(((g >> 6) & 63) | 128),
              d.a.push((g & 63) | 128);
      }
      Q(a, b);
    }
  }
  function bb(a, b, c) {
    null != c &&
      ((c =
        c.constructor === Uint8Array
          ? c
          : c.constructor === ArrayBuffer
          ? new Uint8Array(c)
          : c.constructor === Array
          ? new Uint8Array(c)
          : c.constructor === String
          ? Fa(c)
          : new Uint8Array(0)),
      P(a, b, 2),
      K(a.a, c.length),
      Za(a, c));
  }
  h.Ra = function (a, b, c) {
    null != b && ((a = N(this, a)), c(b, this), Q(this, a));
  };
  h.Sa = function (a, b, c) {
    null != b &&
      (P(this, 1, 3),
      P(this, 2, 0),
      L(this.a, a),
      (a = N(this, 3)),
      c(b, this),
      Q(this, a),
      P(this, 1, 4));
  };
  h.Oa = function (a, b, c) {
    null != b && (P(this, a, 3), c(b, this), P(this, a, 4));
  };
  function eb(a, b, c, d) {
    P(a, b, 0);
    var e = a.a;
    Ka(c, d, function (g, f) {
      F(e, g >>> 0, f >>> 0);
    });
  }
  h.Eb = function (a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) ab(this, a, b[c]);
  };
  h.Fb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && ab(this, a, parseInt(d, 10));
      }
  };
  h.Gb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (null != d) {
          P(this, a, 0);
          var e = this.a;
          y(d);
          F(e, v, w);
        }
      }
  };
  h.Qb = function (a, b, c, d) {
    if (null != b)
      for (var e = 0; e < b.length; e++) {
        var g = c(b[e]),
          f = d(b[e]);
        P(this, a, 1);
        I(this.a, g, f);
      }
  };
  h.Rb = function (a, b, c, d) {
    if (null != b)
      for (var e = 0; e < b.length; e++) {
        var g = c(b[e]),
          f = d(b[e]);
        P(this, a, 0);
        F(this.a, g, f);
      }
  };
  h.Sb = function (a, b, c, d) {
    if (null != b)
      for (var e = 0; e < b.length; e++) eb(this, a, c(b[e]), d(b[e]));
  };
  h.Hb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = a,
          e = b[c];
        null != e && ((e = Qa(e)), P(this, d, 0), F(this.a, e.a, e.b));
      }
  };
  h.Ub = function (a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) cb(this, a, b[c]);
  };
  h.Vb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && cb(this, a, parseInt(d, 10));
      }
  };
  h.Wb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (null != d) {
          P(this, a, 0);
          var e = this.a;
          y(d);
          F(e, v, w);
        }
      }
  };
  h.Xb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = a,
          e = b[c];
        null != e && ((e = B(e)), P(this, d, 0), F(this.a, e.a, e.b));
      }
  };
  h.Mb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 0), Ta(this.a, d));
      }
  };
  h.Nb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (null != d) {
          P(this, a, 0);
          var e = this.a;
          Ia(d);
          F(e, v, w);
        }
      }
  };
  h.Ob = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 0), M(this.a, Ma(d)));
      }
  };
  h.Pb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 0), M(this.a, d));
      }
  };
  h.yb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 5), J(this.a, d));
      }
  };
  h.zb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 1), Ua(this.a, d));
      }
  };
  h.Ab = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = a,
          e = b[c];
        null != e && ((e = B(e)), P(this, d, 1), I(this.a, e.a, e.b));
      }
  };
  h.Jb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 5), Va(this.a, d));
      }
  };
  h.Kb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (null != d) {
          P(this, a, 1);
          var e = this.a;
          y(d);
          I(e, v, w);
        }
      }
  };
  h.Lb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = a,
          e = b[c];
        null != e && ((e = Qa(e)), P(this, d, 1), I(this.a, e.a, e.b));
      }
  };
  h.Cb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (null != d) {
          P(this, a, 5);
          var e = this.a;
          Ja(d);
          J(e, v);
        }
      }
  };
  h.wb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 1), Wa(this.a, d));
      }
  };
  h.ub = function (a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) S(this, a, b[c]);
  };
  h.xb = function (a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) db(this, a, b[c]);
  };
  h.Tb = function (a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) T(this, a, b[c]);
  };
  h.vb = function (a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) bb(this, a, b[c]);
  };
  h.Ib = function (a, b, c) {
    if (null != b)
      for (var d = 0; d < b.length; d++) {
        var e = N(this, a);
        c(b[d], this);
        Q(this, e);
      }
  };
  h.Db = function (a, b, c) {
    if (null != b)
      for (var d = 0; d < b.length; d++)
        P(this, a, 3), c(b[d], this), P(this, a, 4);
  };
  h.Bb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        null != d && (P(this, a, 1), Xa(this.a, d));
      }
  };
  h.Yb = function (a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (null != d) {
          P(this, a, 0);
          var e = this.a;
          z(d);
          F(e, v, w);
        }
      }
  };
  h.ab = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) L(this.a, b[c]);
      Q(this, a);
    }
  };
  h.bb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) L(this.a, parseInt(b[c], 10));
      Q(this, a);
    }
  };
  h.cb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) {
        var d = this.a;
        y(b[c]);
        F(d, v, w);
      }
      Q(this, a);
    }
  };
  h.mb = function (a, b, c, d) {
    if (null != b) {
      a = N(this, a);
      for (var e = 0; e < b.length; e++) I(this.a, c(b[e]), d(b[e]));
      Q(this, a);
    }
  };
  h.nb = function (a, b, c, d) {
    if (null != b) {
      a = N(this, a);
      for (var e = 0; e < b.length; e++) F(this.a, c(b[e]), d(b[e]));
      Q(this, a);
    }
  };
  h.ob = function (a, b, c, d) {
    if (null != b) {
      a = N(this, a);
      for (var e = this.a, g = 0; g < b.length; g++)
        Ka(c(b[g]), d(b[g]), function (f, k) {
          F(e, f >>> 0, k >>> 0);
        });
      Q(this, a);
    }
  };
  h.eb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) {
        var d = Qa(b[c]);
        F(this.a, d.a, d.b);
      }
      Q(this, a);
    }
  };
  h.pb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) K(this.a, b[c]);
      Q(this, a);
    }
  };
  h.qb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) K(this.a, parseInt(b[c], 10));
      Q(this, a);
    }
  };
  h.rb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) {
        var d = this.a;
        y(b[c]);
        F(d, v, w);
      }
      Q(this, a);
    }
  };
  h.sb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) {
        var d = B(b[c]);
        F(this.a, d.a, d.b);
      }
      Q(this, a);
    }
  };
  h.ib = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) Ta(this.a, b[c]);
      Q(this, a);
    }
  };
  h.jb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) {
        var d = this.a;
        Ia(b[c]);
        F(d, v, w);
      }
      Q(this, a);
    }
  };
  h.kb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) M(this.a, Ma(b[c]));
      Q(this, a);
    }
  };
  h.lb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) M(this.a, b[c]);
      Q(this, a);
    }
  };
  h.Wa = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 4 * b.length), a = 0; a < b.length; a++)
        J(this.a, b[a]);
  };
  h.Xa = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 8 * b.length), a = 0; a < b.length; a++)
        Ua(this.a, b[a]);
  };
  h.Ya = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 8 * b.length), a = 0; a < b.length; a++) {
        var c = B(b[a]);
        I(this.a, c.a, c.b);
      }
  };
  h.fb = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 4 * b.length), a = 0; a < b.length; a++)
        Va(this.a, b[a]);
  };
  h.gb = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 8 * b.length), a = 0; a < b.length; a++) {
        var c = this.a;
        y(b[a]);
        I(c, v, w);
      }
  };
  h.hb = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 8 * b.length), a = 0; a < b.length; a++) {
        var c = this.a;
        z(Ma(b[a]));
        I(c, v, w);
      }
  };
  h.$a = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 4 * b.length), a = 0; a < b.length; a++) {
        var c = this.a;
        Ja(b[a]);
        J(c, v);
      }
  };
  h.Ua = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 8 * b.length), a = 0; a < b.length; a++)
        Wa(this.a, b[a]);
  };
  h.Ta = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, b.length), a = 0; a < b.length; a++)
        this.a.a.push(b[a] ? 1 : 0);
  };
  h.Va = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) L(this.a, b[c]);
      Q(this, a);
    }
  };
  h.Za = function (a, b) {
    if (null != b && b.length)
      for (P(this, a, 2), K(this.a, 8 * b.length), a = 0; a < b.length; a++)
        Xa(this.a, b[a]);
  };
  h.tb = function (a, b) {
    if (null != b && b.length) {
      a = N(this, a);
      for (var c = 0; c < b.length; c++) {
        var d = this.a;
        z(b[c]);
        F(d, v, w);
      }
      Q(this, a);
    }
  };
  function fb() {}
  var gb = "function" == typeof Uint8Array;
  fb.prototype.m = function () {
    return this.i;
  };
  function hb(a, b) {
    a.a = null;
    b || (b = []);
    a.i = void 0;
    a.f = -1;
    a.c = b;
    a: {
      if ((b = a.c.length)) {
        --b;
        var c = a.c[b];
        if (
          !(
            null === c ||
            "object" != typeof c ||
            Array.isArray(c) ||
            (gb && c instanceof Uint8Array)
          )
        ) {
          a.h = b - a.f;
          a.b = c;
          break a;
        }
      }
      a.h = Number.MAX_VALUE;
    }
    a.l = {};
  }
  var ib = [];
  function jb(a) {
    var b = a.h + a.f;
    a.c[b] || (a.b = a.c[b] = {});
  }
  function kb(a, b) {
    if (b < a.h) {
      b += a.f;
      var c = a.c[b];
      return c === ib ? (a.c[b] = []) : c;
    }
    if (a.b) return (c = a.b[b]), c === ib ? (a.b[b] = []) : c;
  }
  function U(a, b, c) {
    a = kb(a, b);
    return null == a ? c : a;
  }
  function V(a, b) {
    a = kb(a, b);
    a = null == a ? a : !!a;
    return null == a ? !1 : a;
  }
  function W(a, b, c) {
    return X(a, b, c, "");
  }
  function X(a, b, c, d) {
    c !== d
      ? b < a.h
        ? (a.c[b + a.f] = c)
        : (jb(a), (a.b[b] = c))
      : (a.c[b + a.f] = null);
    return a;
  }
  function lb(a) {
    if (a.a)
      for (var b in a.a) {
        var c = a.a[b];
        if ("array" == xa(c))
          for (var d = 0; d < c.length; d++) c[d] && Y(c[d]);
        else c && Y(c);
      }
  }
  function Y(a) {
    lb(a);
    return a.c;
  }
  h = fb.prototype;
  h.B = gb
    ? function () {
        var a = Uint8Array.prototype.toJSON;
        Uint8Array.prototype.toJSON = function () {
          return Da(this);
        };
        try {
          return JSON.stringify(this.c && Y(this), mb);
        } finally {
          Uint8Array.prototype.toJSON = a;
        }
      }
    : function () {
        return JSON.stringify(this.c && Y(this), mb);
      };
  function mb(a, b) {
    return "number" !== typeof b ||
      (!isNaN(b) && Infinity !== b && -Infinity !== b)
      ? b
      : String(b);
  }
  function nb(a, b) {
    return new a(b ? JSON.parse(b) : null);
  }
  h.toString = function () {
    lb(this);
    return this.c.toString();
  };
  h.da = function (a) {
    if (this.b) {
      this.a || (this.a = {});
      var b = a.c;
      if (a.f) {
        if (a.a())
          return (
            this.a[b] ||
              (this.a[b] = za(this.b[b] || [], function (c) {
                return new a.b(c);
              })),
            this.a[b]
          );
      } else if (a.a())
        return (
          !this.a[b] && this.b[b] && (this.a[b] = new a.b(this.b[b])), this.a[b]
        );
      return this.b[b];
    }
  };
  h.xa = function (a, b) {
    this.a || (this.a = {});
    jb(this);
    var c = a.c;
    a.f
      ? ((b = b || []),
        a.a()
          ? ((this.a[c] = b),
            (this.b[c] = za(b, function (d) {
              return Y(d);
            })))
          : (this.b[c] = b))
      : a.a()
      ? ((this.a[c] = b), (this.b[c] = b ? Y(b) : b))
      : (this.b[c] = b);
    return this;
  };
  h.N = function () {
    return new this.constructor(ob(Y(this)));
  };
  h.ca = function () {
    return new this.constructor(ob(Y(this)));
  };
  function ob(a) {
    if ("array" == xa(a)) {
      for (var b = Array(a.length), c = 0; c < a.length; c++) {
        var d = a[c];
        null != d && (b[c] = "object" == typeof d ? ob(d) : d);
      }
      return b;
    }
    if (gb && a instanceof Uint8Array) return new Uint8Array(a);
    b = {};
    for (c in a)
      (d = a[c]), null != d && (b[c] = "object" == typeof d ? ob(d) : d);
    return b;
  }
  function pb(a) {
    hb(this, a);
  }
  ya(pb, fb);
  h = pb.prototype;
  h.oa = function (a) {
    var b = {
      ga: U(this, 1, ""),
      Z: U(this, 2, ""),
      body: U(this, 3, ""),
      M: U(this, 4, ""),
      V: U(this, 5, ""),
      T: U(this, 6, ""),
      U: U(this, 7, ""),
      ka: U(this, 8, ""),
      Ma: U(this, 9, ""),
      P: V(this, 10),
      O: V(this, 11),
      ma: U(this, 12, 0),
      lang: U(this, 13, ""),
      H: U(this, 14, ""),
      la: U(this, 15, ""),
      L: U(this, 16, ""),
      K: U(this, 17, ""),
      $: V(this, 21),
      X: V(this, 23),
      dir: U(this, 24, ""),
    };
    a && (b.C = this);
    return b;
  };
  h.na = function () {
    var a = new Ya();
    var b = U(this, 1, "");
    0 < b.length && T(a, 1, b);
    b = U(this, 2, "");
    0 < b.length && T(a, 2, b);
    b = U(this, 3, "");
    0 < b.length && T(a, 3, b);
    b = U(this, 4, "");
    0 < b.length && T(a, 4, b);
    b = U(this, 5, "");
    0 < b.length && T(a, 5, b);
    b = U(this, 6, "");
    0 < b.length && T(a, 6, b);
    b = U(this, 7, "");
    0 < b.length && T(a, 7, b);
    b = U(this, 8, "");
    0 < b.length && T(a, 8, b);
    b = U(this, 9, "");
    0 < b.length && T(a, 9, b);
    (b = V(this, 10)) && S(a, 10, b);
    (b = V(this, 11)) && S(a, 11, b);
    b = U(this, 12, 0);
    0 !== b && db(a, 12, b);
    b = U(this, 13, "");
    0 < b.length && T(a, 13, b);
    b = U(this, 14, "");
    0 < b.length && T(a, 14, b);
    b = U(this, 15, "");
    0 < b.length && T(a, 15, b);
    b = U(this, 16, "");
    0 < b.length && T(a, 16, b);
    b = U(this, 17, "");
    0 < b.length && T(a, 17, b);
    (b = V(this, 21)) && S(a, 21, b);
    (b = V(this, 23)) && S(a, 23, b);
    b = U(this, 24, "");
    0 < b.length && T(a, 24, b);
    return $a(a);
  };
  h.Ga = function (a) {
    return W(this, 1, a);
  };
  h.Da = function (a) {
    return W(this, 2, a);
  };
  h.qa = function (a) {
    return W(this, 3, a);
  };
  h.ta = function (a) {
    return W(this, 4, a);
  };
  h.Ba = function (a) {
    return W(this, 5, a);
  };
  h.za = function (a) {
    return W(this, 6, a);
  };
  h.Aa = function (a) {
    return W(this, 7, a);
  };
  h.Ha = function (a) {
    return W(this, 8, a);
  };
  h.Ka = function (a) {
    return W(this, 9, a);
  };
  h.wa = function (a) {
    return X(this, 10, a, !1);
  };
  h.va = function (a) {
    return X(this, 11, a, !1);
  };
  h.Ja = function (a) {
    return X(this, 12, a, 0);
  };
  h.Fa = function (a) {
    return W(this, 13, a);
  };
  h.pa = function (a) {
    return W(this, 14, a);
  };
  h.Ia = function (a) {
    return W(this, 15, a);
  };
  h.sa = function (a) {
    return W(this, 16, a);
  };
  h.ra = function (a) {
    return W(this, 17, a);
  };
  h.Ea = function (a) {
    return X(this, 21, a, !1);
  };
  h.Ca = function (a) {
    return X(this, 23, a, !1);
  };
  h.ua = function (a) {
    return W(this, 24, a);
  };
  var qb = [/^https:\/\/cloud.google.com\/blog.*/, /\.pdf$/, /\.mp4$/];
  function rb() {
    this.a = null;
    this.b = !1;
    try {
      sb(this);
    } catch (a) {
      console.warn(a);
    }
  }
  function sb(a) {
    return a.b
      ? Promise.resolve()
      : new Promise(function (b) {
          var c = wa.indexedDB.open("devsite-index-db", 1);
          c.onsuccess = function () {
            a.a = c.result;
            a.b = !0;
            b();
          };
          c.onerror = function (d) {
            throw Error(d);
          };
          c.onupgradeneeded = function (d) {
            d = d.target.result.createObjectStore("userPreferences", {
              keyPath: "name",
            });
            d.createIndex("name", "name", { unique: !0 });
            d.createIndex("value", "value", { unique: !1 });
          };
        });
  }
  rb.prototype.set = function (a, b) {
    var c = this,
      d,
      e;
    return t(function (g) {
      if (1 == g.a) return p(g, sb(c), 2);
      try {
        return (
          (d = c.a.transaction(["userPreferences"], "readwrite")),
          (e = {}),
          d
            .objectStore("userPreferences")
            .put(((e.name = a), (e.value = b), e)),
          g.return(
            new Promise(function (f) {
              d.oncomplete = f;
            })
          )
        );
      } catch (f) {
        console.warn(f);
      }
      g.a = 0;
    });
  };
  rb.prototype.get = function (a) {
    var b = this,
      c,
      d;
    return t(function (e) {
      if (1 == e.a) return p(e, sb(b), 2);
      try {
        return (
          (c = b.a.transaction(["userPreferences"], "readwrite")),
          (d = c.objectStore("userPreferences").get(a)),
          e.return(
            new Promise(function (g) {
              d.onsuccess = function () {
                g(d.result ? d.result.value : void 0);
              };
            })
          )
        );
      } catch (g) {
        console.warn(g);
      }
      e.a = 0;
    });
  };
  var tb = ["content-length", "etag", "last-modified"];
  function ub(a) {
    return [
      "www.gstatic.com",
      "gsatic.com",
      "fonts.googleapis.com",
      "localhost",
    ].includes(a);
  }
  function vb(a) {
    hb(this, a);
  }
  ya(vb, fb);
  vb.prototype.A = function (a) {
    var b = { action: U(this, 1, 0), url: U(this, 2, "") };
    a && (b.C = this);
    return b;
  };
  vb.prototype.w = function () {
    var a = new Ya();
    var b = U(this, 1, 0);
    0 !== b && db(a, 1, b);
    b = U(this, 2, "");
    0 < b.length && T(a, 2, b);
    return $a(a);
  };
  function wb(a) {
    var b = new vb();
    return X(b, 1, a, 0);
  }
  function xb(a, b) {
    this.g = a;
    this.a = b;
    this.b = new rb();
  }
  function yb(a) {
    var b = Z(a);
    return (
      !(-1 < b.pathname.split("/").pop().indexOf(".")) &&
      b.origin === a.g.location.origin
    );
  }
  function Z(a) {
    return new URL(a.a.url, a.g.location.origin);
  }
  function zb(a) {
    var b = Z(a);
    return yb(a) && b.searchParams.has("partial");
  }
  function Ab(a) {
    return t(function (b) {
      return b.return(a.g.caches.open("devsite.pwa_RUNTIME_v2"));
    });
  }
  function Bb(a) {
    var b, c, d, e;
    return t(function (g) {
      if (1 == g.a) return p(g, a.text(), 2);
      b = g.b;
      try {
        c = nb(pb, b);
      } catch (f) {
        c = null;
      }
      d = new Headers(a.headers);
      d.set("Content-Type", "text/html");
      e = { status: a.status, statusText: a.statusText, headers: d };
      return c
        ? g.return(new Response(U(c, 1, ""), e))
        : g.return(new Response(b, e));
    });
  }
  function Cb(a, b) {
    var c, d;
    return t(function (e) {
      if (1 == e.a)
        return (
          (c = new URL(b)),
          yb(a) ? p(e, a.b.get("language_preference"), 3) : e.j(2)
        );
      2 != e.a && ((d = e.b), c.searchParams.set("hl", d || "en"));
      return e.return(c);
    });
  }
  function Db(a) {
    var b, c, d, e, g;
    return t(function (f) {
      switch (f.a) {
        case 1:
          return p(f, Ab(a), 2);
        case 2:
          return (b = f.b), (c = Z(a)), p(f, Cb(a, c.href), 3);
        case 3:
          d = f.b;
          if (!yb(a) || zb(a)) {
            f.j(4);
            break;
          }
          e = new URL(d.href);
          e.searchParams.set("partial", "1");
          return p(f, b.match(e.href), 5);
        case 5:
          if ((g = f.b)) {
            return f.return(Promise.resolve(Bb(g)));
          }
          break;
        case 4:
          return f.return(b.match(d.href));
      }
    });
  }  function Eb(a, b) {
    return a && b
      ? tb.some(function (c) {
          return a.headers.has(c) && b.headers.has(c);
        })
        ? tb.every(function (c) {
            return (
              a.headers.has(c) === b.headers.has(c) &&
              a.headers.get(c) === b.headers.get(c)
            );
          })
        : !1
      : !1;
  }
  function Fb(a, b) {
    var c, d;
    t(function (e) {
      if (1 == e.a) return (c = b.B()), p(e, a.g.clients.matchAll(), 2);
      d = e.b;
      d.forEach(function (g) {
        g.postMessage(c);
      });
      e.a = 0;
    });
  }
  function Gb(a) {
    var b, c, d, e;
    return t(function (g) {
      switch (g.a) {
        case 1:
          return p(g, Ab(a), 2);
        case 2:
          return (b = g.b), p(g, Cb(a, a.a.url), 3);
        case 3:
          return (c = g.b), p(g, b.match(c.href), 4);
        case 4:
          return (
            (d = g.b),
            (e = a.g
              .fetch(a.a)
              .then(function (f) {
                if (
                  f &&
                  (b.put(c.href, f.clone()),
                  d &&
                    Z(a).pathname.match(
                      /\.(jpeg|jpg|gif|png|svg|webp|avi|mp4|mov)$/
                    ) &&
                    !Eb(d, f) &&
                    Array.from(f.headers.keys()).length)
                ) {
                  var k = wb(2);
                  k = W(k, 2, a.a.url);
                  Fb(a, k);
                }
                return f;
              })
              .catch(function () {
                return Hb();
              })),
            g.return(d || e)
          );
      }
    });
  }
  xb.prototype.fetch = function () {
    var a = this,
      b;
    return t(function (c) {
      if (1 == c.a) {
        if ("GET" !== a.a.method) var d = !1;
        else
          (d = Z(a)),
            (d = d.hostname === a.g.location.hostname ? !0 : ub(d.hostname));
        return d ? p(c, Db(a), 2) : c.return(a.g.fetch(a.a));
      }
      if ((d = b = c.b)) {
        d = b.headers.get("date");
        var e = b.headers.get("expires"),
          g = new Date(d),
          f = new Date(e);
        e = e && 0 > Date.now() - f.getTime();
        d = !!((d && 6e4 > Date.now() - g.getTime()) || e);
      }
      d
        ? (c = c.return(Promise.resolve(b)))
        : ((g = Z(a)),
          (d = !!g.pathname.match(
            /\.(jpeg|jpg|gif|png|svg|webp|avi|mp4|mov|css|js)$/
          )),
          (g = g.origin === a.g.location.origin || ub(g.hostname)),
          (c = d && g ? c.return(Gb(a)) : c.return(Ib(a))));
      return c;
    });
  };
  function Jb(a, b) {
    var c, d;
    return t(function (e) {
      switch (e.a) {
        case 1:
          return p(e, Ab(a), 2);
        case 2:
          c = e.b;
          if (!c) {
            e.j(0);
            break;
          }
          e.f = 4;
          return p(e, Cb(a, a.a.url), 6);
        case 6:
          d = e.b;
          b.ok
            ? c.put(d.href, b.clone())
            : 404 === b.status && c.delete(d.href);
          oa(e, 0);
          break;
        case 4:
          pa(e), (e.a = 0);
      }
    });
  }
  function Hb() {
    return new Response(
      "<h4>انترنت قطع شده است </h4> <br /> <a href=" / ">صفحه اصلی </a>",
      {
        status: 503,
        statusText:
          "<h4>انترنت قطع شده است </h4> <br /> <a href=" / ">صفحه اصلی </a>",
        headers: new Headers({ "Content-Type": "text/html" }),
      }
    );
  }
  function Ib(a) {
    var b, c, d, e, g;
    return t(function (f) {
      switch (f.a) {
        case 1:
          return (f.f = 2), p(f, a.g.fetch(a.a.clone()), 4);
        case 4:
          b = f.b;
          if (b) {
            return p(f, Jb(a, b), 8);
          } else {
            return p(f, Db(a), 7);
          }
        case 7:
          c = f.b;
          if (c) {
            return f.return(c);
          }
          return f.return(Hb());
        case 8:
          return f.return(b);
        case 6:
          oa(f, 0);
          break;
        case 2:
          pa(f);
          return p(f, Db(a), 9);
        case 9:
          d = f.b;
          if (d) {
            return f.return(d);
          }
          if (!yb(a)) {
            f.j(10);
            break;
          }
          return p(f, Ab(a), 11);
        case 11:
          e = f.b;
          return p(f, e.match("/_static/offline?partial=1"), 12);
        case 12:
          g = f.b;
          if (g) {
            return zb(a) ? f.return(g) : f.return(Bb(g));
          }
          break;
        case 10:
          return f.return(Hb());
      }
    });

  }  var Kb = [/^utm_/, /^dcb_$/];  function Lb(a) {    this.g = a;
    this.c = "1.1";
    this.a = {};
    Mb(this);
  }
  function Nb(a) {
    var b, c;
    return t(function (d) {
      if (1 == d.a) return p(d, a.g.caches.keys(), 2);
      b = d.b;
      c = b.filter(function (e) {
        return "devsite.pwa_RUNTIME_v2" !== e;
      });
      return p(
        d,
        Promise.all(
          c.map(function (e) {
            return a.g.caches.delete(e);
          })
        ),
        0
      );
    });
  }
  function Mb(a) {
    var b;
    t(function (c) {
      if (1 == c.a)
        return a.a["devsite.pwa_RUNTIME_v2"]
          ? c.return(a.a["devsite.pwa_RUNTIME_v2"])
          : p(c, a.g.caches.open("devsite.pwa_RUNTIME_v2"), 2);
      b = c.b;
      a.a["devsite.pwa_RUNTIME_v2"] = b;
      return c.return(b);
    });
  }
  function Ob(a) {
    return !(
      "navigate" !== a.mode &&
      !a.headers.get("Upgrade-Insecure-Requests") &&
      -1 === (a.headers.get("Accept") || "").indexOf("text/html")
    );
  }
  function Pb(a, b) {
    var c, d, e, g, f, k, m, q, x, O, D, G, R, E;
    return t(function (H) {
      switch (H.a) {
        case 1:
          c = b.clone();
          d = new URL(b.url, a.g.location.origin);
          if (Ob(b) || (d.origin !== a.g.location.origin && !ub(d.hostname)))
            return H.return(Promise.resolve(c));
          d.hash = "";
          e = Array.from(d.searchParams);
          g = {};
          f = l(e);
          for (k = f.next(); !k.done; g = { o: g.o }, k = f.next())
            (m = k.value),
              (q = l(m)),
              (g.o = q.next().value),
              q.next(),
              Kb.forEach(
                (function (La) {
                  return function (Rb) {
                    La.o.match(Rb) && d.searchParams.delete(La.o);
                  };
                })(g)
              );
          x = new Headers();
          O = l(b.headers.entries());
          for (D = O.next(); !D.done; D = O.next())
            (G = D.value), G[1] && x.append(G[0], G[1]);
          H.f = 2;
          return p(H, b.text(), 4);
        case 4:
          R = H.b;
          oa(H, 3);
          break;
        case 2:
          return pa(H), H.return(Promise.resolve(c));
        case 3:
          E = {};
          E.method = b.method;
          E.mode = b.mode;
          E.body = R;
          E.redirect = b.redirect;
          E.headers = x;
          E.credentials = b.credentials;
          E.cache = b.cache;
          E.referrer = b.referrer;
          try {
            return H.return(Promise.resolve(new Request(d.href, E)));
          } catch (La) {
            return H.return(Promise.resolve(c));
          }
      }
    });
  }
  function Qb(a, b) {
    var c, d;
    return t(function (e) {
      if (1 == e.a) return p(e, Pb(a, b.clone()), 2);
      c = e.b;
      d = new xb(a.g, c);
      return e.return(d.fetch());
    });
  }
  Lb.prototype.b = function (a) {
    
  };
  function Sb(a, b) {
    var c, d, e, g, f, k, m;
    t(function (q) {
      if (1 == q.a)
        return (
          (c = a.g.location),
          (d = c.origin),
          (e = new URL(b, c.origin)),
          (g = e.origin),
          (f = e.pathname),
          (k = {}),
          ub(e.hostname) || 0 === f.indexOf("/_static")
            ? (k.mode = "cors")
            : g === d
            ? (k.credentials = "include")
            : (k.mode = "no-cors"),
          (m = new Request(b, k)),
          (q.f = 2),
          p(q, Qb(a, m), 4)
        );
      if (2 != q.a) return oa(q, 0);
      pa(q);
      return q.return();
    });
  }
  function Tb(a, b) {
    var c = "POST" === b.request.method;
    qb.find(function (d) {
      return d.test(b.request.url);
    }) && (c = !0);
    c || b.respondWith(Qb(a.a, b.request));
  }
  function Ub(a, b) {
    b.waitUntil(
      Nb(a.a)
        .then(function () {
          return a.g.clients.claim();
        })
        .then(function () {
          var c, d, e;
          return t(function (g) {
            if (1 == g.a)
              return (
                (c = wb(4)),
                (d = c.B()),
                p(g, a.g.clients.matchAll({ type: "window" }), 2)
              );
            e = g.b;
            e.forEach(function (f) {
              f.postMessage(d);
            });
            g.a = 0;
          });
        })
    );
  }
  function Vb(a, b) {
    var c, d, e;
    return t(function (g) {
      if (1 == g.a) {
        c = b;
        try {
          d = nb(vb, c.data);
        } catch (f) {
          return g.return();
        }
        switch (U(d, 1, 0)) {
          case 1:
            Sb(a.a, U(d, 2, ""));
            break;
          case 3:
            return g.j(2);
        }
        return g.j(0);
      }
      if (4 != g.a) return p(g, a.g.clients.matchAll({ type: "window" }), 4);
      e = g.b;
      e.forEach(function (f) {
        f.id !== c.source.id && f.postMessage(c.data);
      });
      return g.j(0);
    });
  }
  new (function () {
    var a = self,
      b = this;
    this.g = a;
    this.a = new Lb(a);
    this.g.addEventListener(
      "install",
      function (c) {
        c.waitUntil(b.g.skipWaiting());
      },
      !1
    );
    this.g.addEventListener(
      "fetch",
      function (c) {
        return Tb(b, c);
      },
      !1
    );
    this.g.addEventListener(
      "activate",
      function (c) {
        return Ub(b, c);
      },
      !1
    );
    this.g.addEventListener(
      "message",
      function (c) {
        return Vb(b, c);
      },
      !1
    );
  })();
}.call(this));
