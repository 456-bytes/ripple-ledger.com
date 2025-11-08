(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [332], {
        2022: (e, n, s) => {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/", function () {
                return s(4311)
            }])
        },
        4311: (e, n, s) => {
            "use strict";
            s.r(n), s.d(n, {
                default: () => v
            });
            var a = s(4848),
                i = s(9680),
                r = s.n(i),
                t = s(9965),
                c = s.n(t),
                l = s(1106),
                o = s.n(l),
                d = s(2345),
                h = s.n(d),
                m = s(6540),
                _ = s(6715);
            let x = () => {
                    let [e, n] = (0, m.useState)(!1), s = (0, _.useRouter)();
                    return (0, a.jsx)(a.Fragment, {
                        children: (0, a.jsx)("nav", {
                            className: h().navbar,
                            children: (0, a.jsxs)("div", {
                                className: h().navbarContainer,
                                children: [(0, a.jsx)(o(), {
                                    href: "/",
                                    legacyBehavior: !0,
                                    children: (0, a.jsx)("a", {
                                        className: h().logo,
                                        children: (0, a.jsx)(c(), {
                                            src: "/images/dev.svg",
                                            alt: "XRPL.org",
                                            width: 200,
                                            height: 200
                                        })
                                    })
                                }), (0, a.jsx)("button", {
                                    className: h().navbarToggler,
                                    onClick: () => n(!e),
                                    children: (0, a.jsx)("span", {
                                        className: h().togglerIcon
                                    })
                                }), (0, a.jsx)("div", {
                                    className: "".concat(h().navbarMenu, " ").concat(e ? h().show : ""),
                                    children: (0, a.jsxs)("ul", {
                                        className: h().navList,
                                        children: [(0, a.jsx)("li", {
                                            className: h().navItem,
                                            children: (0, a.jsx)(o(), {
                                                href: "/about",
                                                legacyBehavior: !0,
                                                children: (0, a.jsx)("a", {
                                                    children: "About"
                                                })
                                            })
                                        }), (0, a.jsx)("li", {
                                            className: h().navItem,
                                            children: (0, a.jsx)(o(), {
                                                href: "/docs",
                                                legacyBehavior: !0,
                                                children: (0, a.jsx)("a", {
                                                    children: "Docs"
                                                })
                                            })
                                        }), (0, a.jsx)("li", {
                                            className: h().navItem,
                                            children: (0, a.jsx)(o(), {
                                                href: "/resources",
                                                legacyBehavior: !0,
                                                children: (0, a.jsx)("a", {
                                                    children: "Resources"
                                                })
                                            })
                                        }), (0, a.jsx)("li", {
                                            className: h().navItem,
                                            children: (0, a.jsx)(o(), {
                                                href: "/community",
                                                legacyBehavior: !0,
                                                children: (0, a.jsx)("a", {
                                                    children: "Community"
                                                })
                                            })
                                        }), (0, a.jsx)("br", {}), (0, a.jsx)("li", {
                                            className: h().navItem,
                                            children: (0, a.jsx)("button", {
                                                className: h().walletButton,
                                                onClick: () => s.push("/signin"),
                                                children: "Sign in / Sign up"
                                            })
                                        })]
                                    })
                                })]
                            })
                        })
                    })
                },
                j = {
                    src: "/_next/static/media/hero.6da3166d.svg",
                    height: 492,
                    width: 897,
                    blurWidth: 0,
                    blurHeight: 0
                };
            var u = s(3368),
                g = s.n(u);

            function v() {
                let e = (0, _.useRouter)();
                return (0, a.jsxs)("div", {
                    children: [(0, a.jsxs)(g(), {
                        children: [(0, a.jsx)("title", {
                            children: "Stake XRP"
                        }), (0, a.jsx)("link", {
                            rel: "icon",
                            href: "/icons/logo.png"
                        }), (0, a.jsx)("meta", {
                            charSet: "UTF-8"
                        }), (0, a.jsx)("meta", {
                            name: "description",
                            content: "Stake XRP"
                        }), (0, a.jsx)("meta", {
                            name: "keywords",
                            content: "Stake XRP"
                        }), (0, a.jsx)("meta", {
                            name: "author",
                            content: "Stake XRP"
                        }), (0, a.jsx)("meta", {
                            name: "viewport",
                            content: "minimum-scale=1, initial-scale=1, width=device-width"
                        })]
                    }), (0, a.jsxs)("main", {
                        className: r().main,
                        children: [(0, a.jsx)(x, {}), (0, a.jsxs)("section", {
                            className: r().container,
                            children: [(0, a.jsx)(c(), {
                                src: j,
                                alt: "XRPL.org",
                                width: 100,
                                height: 100,
                                className: r().hero
                            }), (0, a.jsxs)("div", {
                                className: r().connect_section,
                                children: [(0, a.jsx)("h2", {
                                    children: "XRPL | XRP Ledger"
                                }), (0, a.jsxs)("h1", {
                                    children: ["The Blockchain", (0, a.jsx)("br", {}), "Built for Business"]
                                }), (0, a.jsxs)("button", {
                                    className: r().walletButton,
                                    onClick: () => e.push("/signin"),
                                    children: [" ", "Sign in / Sign up"]
                                })]
                            }), (0, a.jsxs)("div", {
                                className: r().contentBox,
                                children: [(0, a.jsx)("h2", {
                                    className: r().heading,
                                    style: {
                                        paddingTop: "12rem"
                                    },
                                    children: "The XRP Ledger: The Blockchain Built for Business"
                                }), (0, a.jsx)("h6", {
                                    className: r().subheading,
                                    children: "The XRP Ledger (XRPL) is a decentralized, public blockchain led by a global community of businesses and developers looking to solve problems and create value."
                                }), (0, a.jsx)("p", {
                                    className: r().text,
                                    children: "Proven reliable over more than a decade of error-free functioning, the XRPL offers streamlined development, low transaction costs, high performance, and sustainability."
                                })]
                            })]
                        }), (0, a.jsxs)("section", {
                            className: r().container,
                            children: [(0, a.jsxs)("div", {
                                className: r().contentBox,
                                children: [(0, a.jsx)("h3", {
                                    className: r().heading,
                                    children: "Why developers choose the XRP Ledger"
                                }), (0, a.jsx)("h6", {
                                    className: r().eyebrow,
                                    children: "Benefits"
                                })]
                            }), (0, a.jsx)("ul", {
                                className: r().grid,
                                children: N.map(e => (0, a.jsxs)("li", {
                                    className: r().card,
                                    children: [(0, a.jsx)(c(), {
                                        src: "/icons/".concat(e.id, ".svg"),
                                        alt: e.title,
                                        width: 50,
                                        height: 50
                                    }), (0, a.jsx)("h4", {
                                        className: r().cardTitle,
                                        children: e.title
                                    }), (0, a.jsx)("p", {
                                        className: r().cardText,
                                        children: e.description
                                    })]
                                }, e.id))
                            })]
                        }), (0, a.jsxs)("section", {
                            className: r().container,
                            children: [(0, a.jsxs)("div", {
                                className: r().contentBox,
                                children: [(0, a.jsx)("h3", {
                                    className: r().heading,
                                    children: "Powerful Features"
                                }), (0, a.jsx)("h6", {
                                    className: r().eyebrow,
                                    children: "Activate the proven potential of the XRP Ledger"
                                })]
                            }), (0, a.jsx)("div", {
                                className: r().grid,
                                children: p.map(e => (0, a.jsx)(o(), {
                                    href: e.link,
                                    className: r().cardLink,
                                    children: (0, a.jsxs)("div", {
                                        className: r().card,
                                        children: [(0, a.jsx)("h4", {
                                            className: r().cardTitle,
                                            children: e.title
                                        }), (0, a.jsx)("p", {
                                            className: r().cardText,
                                            children: e.description
                                        })]
                                    })
                                }, e.id))
                            })]
                        }), (0, a.jsxs)("footer", {
                            className: r().footer,
                            children: [(0, a.jsxs)("section", {
                                className: r().footerContent,
                                children: [(0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("h5", {
                                        children: "About"
                                    }), (0, a.jsxs)("ul", {
                                        children: [(0, a.jsx)("li", {
                                            children: (0, a.jsx)(o(), {
                                                href: "#",
                                                children: "XRPL Overview"
                                            })
                                        }), (0, a.jsx)("li", {
                                            children: (0, a.jsx)(o(), {
                                                href: "#",
                                                children: "History"
                                            })
                                        })]
                                    })]
                                }), (0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("h5", {
                                        children: "Docs"
                                    }), (0, a.jsxs)("ul", {
                                        children: [(0, a.jsx)("li", {
                                            children: (0, a.jsx)(o(), {
                                                href: "#",
                                                children: "Documentation"
                                            })
                                        }), (0, a.jsx)("li", {
                                            children: (0, a.jsx)(o(), {
                                                href: "#",
                                                children: "Tutorials"
                                            })
                                        })]
                                    })]
                                })]
                            }), (0, a.jsxs)("div", {
                                className: r().copyright,
                                children: ["\xa9 2025 XRP Ledger.", " ", (0, a.jsx)(o(), {
                                    href: "https://github.com/XRPLF",
                                    children: "GitHub"
                                })]
                            })]
                        })]
                    })]
                })
            }
            let N = [{
                    id: "public",
                    title: "Public and Decentralized",
                    description: "Open source, open to anyone to build on"
                }, {
                    id: "low-cost",
                    title: "Low Cost",
                    description: "Fractions of a penny per transaction"
                }, {
                    id: "reliability",
                    title: "Proven Reliability",
                    description: "10+ years of error-free performance"
                }],
                p = [{
                    id: "dex",
                    title: "Decentralized Exchange",
                    description: "A high-performance decentralized peer-to-peer multi-currency exchange built directly into the blockchain",
                    link: "decentralized-exchange.html"
                }, {
                    id: "tokens",
                    title: "Tokens",
                    description: "All currencies other than XRP can be represented in the XRP Ledger as tokens, Represent currencies as XRPL tokens",
                    link: "tokens.html"
                }]
        },
        2345: e => {
            e.exports = {
                Navbar: "Nav_Navbar__oUb2z",
                navbar: "Nav_navbar__UHZRX",
                navbarContainer: "Nav_navbarContainer__g88d_",
                logo: "Nav_logo__RYI5o",
                navbarMenu: "Nav_navbarMenu__dXVOh",
                navList: "Nav_navList__CrcpB",
                navItem: "Nav_navItem__V_nzb",
                walletButton: "Nav_walletButton__3Wenw",
                navbarToggler: "Nav_navbarToggler__CRHlw",
                togglerIcon: "Nav_togglerIcon__HDpM8",
                show: "Nav_show__BOBlh",
                open: "Nav_open__OjoqJ"
            }
        },
        9680: e => {
            e.exports = {
                main: "Home_main__VkIEL",
                hero: "Home_hero__VkeT1",
                connect_section: "Home_connect_section__iN9W8",
                walletButton: "Home_walletButton__HsXT6",
                container: "Home_container__d256j",
                contentBox: "Home_contentBox__a2GZ1",
                heading: "Home_heading__f_gSb",
                subheading: "Home_subheading__M4K88",
                text: "Home_text__FLP25",
                grid: "Home_grid__AVljO",
                card: "Home_card__E5spL",
                cardTitle: "Home_cardTitle__rMNyu",
                cardText: "Home_cardText__Cg7Ud",
                cardLink: "Home_cardLink__EqSxN",
                footer: "Home_footer__yFiaX",
                footerContent: "Home_footerContent__RZUDB",
                copyright: "Home_copyright__Iq1SU"
            }
        }
    },
    e => {
        var n = n => e(e.s = n);
        e.O(0, [965, 392, 636, 593, 792], () => n(2022)), _N_E = e.O()
    }
]);