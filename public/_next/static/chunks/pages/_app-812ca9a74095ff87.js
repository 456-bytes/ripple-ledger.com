(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [636], {
        8424: (e, t, n) => {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/_app", function () {
                return n(898)
            }])
        },
        898: (e, t, n) => {
            "use strict";
            n.r(t), n.d(t, {
                default: () => o
            });
            var s = n(4848);
            n(4472);
            var a = n(3368),
                r = n.n(a),
                i = n(6540);
            let c = () => ((0, i.useEffect)(() => {
                if (!window.smartsupp) {
                    let e = document.createElement("script");
                    e.type = "text/javascript", e.async = !0, e.src = "https://www.smartsuppchat.com/loader.js?", document.body.appendChild(e);
                    let t = function () {
                        for (var e = arguments.length, n = Array(e), s = 0; s < e; s++) n[s] = arguments[s];
                        t._.push(n)
                    };
                    t._ = [], window.smartsupp = t, window._smartsupp = {
                        key: "ae019b33383faf379bdf7b92bc910854722e7920",
                        _: []
                    }
                }
            }, []), null);

            function o(e) {
                let {
                    Component: t,
                    pageProps: n
                } = e;
                return (0, s.jsxs)("div", {
                    children: [(0, s.jsxs)(r(), {
                        children: [(0, s.jsx)("title", {
                            children: "Stake XRP"
                        }), (0, s.jsx)("link", {
                            rel: "icon",
                            href: "/icons/logo.png"
                        }), (0, s.jsx)("meta", {
                            charSet: "UTF-8"
                        }), (0, s.jsx)("meta", {
                            name: "description",
                            content: "Stake XRP"
                        }), (0, s.jsx)("meta", {
                            name: "keywords",
                            content: "Stake XRP"
                        }), (0, s.jsx)("meta", {
                            name: "author",
                            content: "Stake XRP"
                        }), (0, s.jsx)("meta", {
                            name: "viewport",
                            content: "minimum-scale=1, initial-scale=1, width=device-width"
                        })]
                    }), (0, s.jsx)(t, {
                        ...n
                    }), (0, s.jsx)(c, {})]
                })
            }
        },
        4472: () => {},
        3368: (e, t, n) => {
            e.exports = n(6085)
        }
    },
    e => {
        var t = t => e(e.s = t);
        e.O(0, [593, 792], () => (t(8424), t(8440))), _N_E = e.O()
    }
]);