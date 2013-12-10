$M = {
    gammastirf: function(x) {
        var y, w, v, stir;

        w = 1 / x;
        stir = 7.87311395793093628397E-4;
        stir = -2.29549961613378126380E-4 + w * stir;
        stir = -2.68132617805781232825E-3 + w * stir;
        stir = 3.47222221605458667310E-3 + w * stir;
        stir = 8.33333333333482257126E-2 + w * stir;
        w = 1 + w * stir;
        y = Math.exp(x);
        if (x > 143.01608) {
            v = Math.pow(x, 0.5 * x - 0.25);
            y = v * (v / y);
        }
        else {
            y = Math.pow(x, x - 0.5) / y;
        }
        return 2.50662827463100050242 * y * w;
    },
    
    gammafunction: function(x) {
        var p, pp, qq, z, i,
            q = Math.abs(x), sgngam = 1;

        if (q > 33.0) {
            if (x < 0.0) {
                p = Math.floor(q);
                i = Math.round(p);
                if (i % 2 == 0) {
                    sgngam = -1;
                }
                z = q - p;
                if (z > 0.5) {
                    p = p + 1;
                    z = q - p;
                }
                z = q * Math.sin(Math.PI * z);
                z = Math.abs(z);
                z = Math.PI / (z * this.gammastirf(q));
            }
            else {
                z = this.gammastirf(x);
            }                
            return sgngam * z;
        }
        z = 1;
        while (x >= 3) {
            x = x - 1;
            z = z * x;
        }
        while (x < 0) {
            if (x > -0.000000001) {
                return z / ((1 + 0.5772156649015329 * x) * x);
            }
            z = z / x;
            x = x + 1;
        }
        while (x < 2) {
            if (x < 0.000000001) {
                return z / ((1 + 0.5772156649015329 * x) * x);
            }
            z = z / x;
            x = x + 1.0;
        }
        if (x == 2) {
            return z;
        }
        x = x - 2.0;
        pp = 1.60119522476751861407E-4;
        pp = 1.19135147006586384913E-3 + x * pp;
        pp = 1.04213797561761569935E-2 + x * pp;
        pp = 4.76367800457137231464E-2 + x * pp;
        pp = 2.07448227648435975150E-1 + x * pp;
        pp = 4.94214826801497100753E-1 + x * pp;
        pp = 9.99999999999999996796E-1 + x * pp;
        qq = -2.31581873324120129819E-5;
        qq = 5.39605580493303397842E-4 + x * qq;
        qq = -4.45641913851797240494E-3 + x * qq;
        qq = 1.18139785222060435552E-2 + x * qq;
        qq = 3.58236398605498653373E-2 + x * qq;
        qq = -2.34591795718243348568E-1 + x * qq;
        qq = 7.14304917030273074085E-2 + x * qq;
        qq = 1.00000000000000000320 + x * qq;
        return z * pp / qq;
    },



    lngamma: function(x) {
        var a, b, c, p, q, u, w, z,
            logpi = 1.14472988584940017414, 
            ls2pi = 0.91893853320467274178;
            
            if (x < -34) {
                q = -x;
                w = this.lngamma(q);
                p = Math.floor(q);
                z = q - p;
                if (z > 0.5) {
                    p = p+1;
                    z = p-q;
                }
                z = q * Math.sin(Math.PI * z);
                return logpi - Math.log(z) - w;
            }
            if (x < 13) {
                z = 1;
                p = 0;
                u = x;
                while (u >= 3) {
                    p = p - 1;
                    u = x + p;
                    z = z * u;
                }
                while (u < 2) {
                    z = z / u;
                    p = p + 1;
                    u = x + p;
                }
                if (z < 0) {
                    z = -z;
                }
                if (u == 2) {
                    return Math.log(z);
                }
                p = p - 2;
                x = x + p;
                b = -1378.25152569120859100;
                b = -38801.6315134637840924 + x * b;
                b = -331612.992738871184744 + x * b;
                b = -1162370.97492762307383 + x * b;
                b = -1721737.00820839662146 + x * b;
                b = -853555.664245765465627 + x * b;
                c = 1;
                c = -351.815701436523470549 + x * c;
                c = -17064.2106651881159223 + x * c;
                c = -220528.590553854454839 + x * c;
                c = -1139334.44367982507207 + x * c;
                c = -2532523.07177582951285 + x * c;
                c = -2018891.41433532773231 + x * c;
                p = x * b / c;
                return Math.log(z) + p;
            }
            q = (x - 0.5) * Math.log(x) - x + ls2pi;
            if (x > 100000000) {
                return q;
            }
            p = 1 / (x * x);
            if (x >= 1000) {
                q = q + ((7.9365079365079365079365 * 0.0001 * p - 2.7777777777777777777778 * 0.001) * p + 0.0833333333333333333333) / x;
            }
            else {
                a = 8.11614167470508450300 * 0.0001;
                a = -(5.95061904284301438324 * 0.0001) + p * a;
                a = 7.93650340457716943945 * 0.0001 + p * a;
                a = -(2.77777777730099687205 * 0.001) + p * a;
                a = 8.33333333333331927722 * 0.01 + p * a;
                q = q + a / x;
            }
            return q;
    },

    incompletegamma: function(a, x) {
        var ans, ax, c, r,
            igammaepsilon = 0.000000000000001;
            
            if (x <= 0 || a <=0) {
                return 0;
            }
            if(x > 1 && x > a) {
                return 1 - this.incompletegammac(a, x);
            }
            ax = a * Math.log(x) - x - this.lngamma(a);
            if (ax < -709.78271289338399) {
                return 0;
            }
            ax = Math.exp(ax);
            r = a;
            c = 1;
            ans = 1;
            do
            {
                r = r + 1;
                c = c * x / r;
                ans = ans + c;
            }
            while(c / ans > igammaepsilon);
            return ans * ax / a;
    },


    incompletegammac: function(a, x) {
        var ans, ax, c, yc, r, t, y, z, pk, pkm1, pkm2, qk, qkm1, qkm2,
            igammaepsilon = 0.000000000000001,
            igammabignumber = 4503599627370496.0,
            igammabignumberinv = 2.22044604925031308085 * 0.0000000000000001;
            
            if (x <= 0 || a <= 0) {
                return 1;
            }
            if (x < 1 || x < a) {
                return 1 - this.incompletegamma(a, x);
            }
            ax = a * Math.log(x) - x - this.lngamma(a);
            if (ax < -709.78271289338399) {
                return 0;
            }
            ax = Math.exp(ax);
            y = 1 - a;
            z = x + y + 1;
            c = 0;
            pkm2 = 1;
            qkm2 = x;
            pkm1 = x + 1;
            qkm1 = z * x;
            ans = pkm1 / qkm1;
            do {
                c = c + 1;
                y = y + 1;
                z = z + 2;
                yc = y * c;
                pk = pkm1 * z - pkm2 * yc;
                qk = qkm1 * z - qkm2 * yc;
                if (qk != 0) {
                    r = pk / qk;
                    t = Math.abs((ans - r) / r);
                    ans = r;
                }
                else {
                    t = 1;
                }
                pkm2 = pkm1;
                pkm1 = pk;
                qkm2 = qkm1;
                qkm1 = qk;
                if (Math.abs(pk) > igammabignumber) {
                    pkm2 = pkm2 * igammabignumberinv;
                    pkm1 = pkm1 * igammabignumberinv;
                    qkm2 = qkm2 * igammabignumberinv;
                    qkm1 = qkm1 * igammabignumberinv;
                }
            }
            while (t > igammaepsilon);
            return ans*ax
    },
    
    incompletebetaps: function(a, b, x, maxgam) {
        var s, t, u, v, n, t1, z, ai;

        ai = 1.0 / a;
        u = (1.0 - b) * x;
        v = u / (a + 1.0);
        t1 = v;
        t = u;
        n = 2.0;
        s = 0.0;
        z = $M.eps * ai;
        while(Math.abs(v) > z) {
            u = (n - b) * x / n;
            t = t * u;
            v = t / (a + n);
            s = s + v;
            n = n + 1.0;
        }
        s = s + t1;
        s = s + ai;
        u = a * Math.log(x);
        if (a+b < maxgam && Math.abs(u) < Math.log(Number.MAX_VALUE)) {
            t = this.gammafunction(a + b) / (this.gammafunction(a) * this.gammafunction(b));
            s = s * t * Math.pow(x, a);
        }
        else {
            t = this.lngamma(a + b) - this.lngamma(a) - this.lngamma(b) + u + Math.log(s);
            if (t < Math.log(Number.MIN_VALUE)) {
                s = 0.0;
            }
            else {
                s = Math.exp(t);
            }
        }
        return s;
    },
    
    incompletebetafe: function(a, b, x, big, biginv) {
        var xk, pk, pkm1, pkm2, qk, qkm1, qkm2,
        k1, k2, k3, k4, k5, k6, k7, k8,
        r, t, ans, thresh, n;

        k1 = a;
        k2 = a + b;
        k3 = a;
        k4 = a + 1.0;
        k5 = 1.0;
        k6 = b - 1.0;
        k7 = k4;
        k8 = a + 2.0;
        pkm2 = 0.0;
        qkm2 = 1.0;
        pkm1 = 1.0;
        qkm1 = 1.0;
        ans = 1.0;
        r = 1.0;
        n = 0;
        thresh = 3.0 * $M.eps;
        do {
            xk = -(x * k1 * k2 / (k3 * k4));
            pk = pkm1 + pkm2 * xk;
            qk = qkm1 + qkm2 * xk;
            pkm2 = pkm1;
            pkm1 = pk;
            qkm2 = qkm1;
            qkm1 = qk;
            xk = x * k5 * k6 / (k7 * k8);
            pk = pkm1 + pkm2 * xk;
            qk = qkm1 + qkm2 * xk;
            pkm2 = pkm1;
            pkm1 = pk;
            qkm2 = qkm1;
            qkm1 = qk;
            if (qk != 0) {
                r = pk / qk;
            }
            if (r != 0) {
                t = Math.abs((ans - r) / r);
                ans = r;
            }
            else {
                t = 1.0;
            }
            if(t < thresh) {
                break;
            }
            k1 = k1 + 1.0;
            k2 = k2 + 1.0;
            k3 = k3 + 2.0;
            k4 = k4 + 2.0;
            k5 = k5 + 1.0;
            k6 = k6 - 1.0;
            k7 = k7 + 2.0;
            k8 = k8 + 2.0;
            if (Math.abs(qk) + Math.abs(pk) > big) {
                pkm2 = pkm2 * biginv;
                pkm1 = pkm1 * biginv;
                qkm2 = qkm2 * biginv;
                qkm1 = qkm1 * biginv;
            }
            if (Math.abs(qk) < biginv || Math.abs(pk) < biginv) {
                pkm2 = pkm2 * big;
                pkm1 = pkm1 * big;
                qkm2 = qkm2 * big;
                qkm1 = qkm1 * big;
            } 
            n = n + 1;
        }
        while(n != 300);
        return ans;
    },

    incompletebetafe2: function(a, b, x, big, biginv) {
        var xk, pk, pkm1, pkm2, qk, qkm1, qkm2,
        k1, k2, k3, k4, k5, k6, k7, k8,
        r, t, z, ans, thresh, n;

        k1 = a;
        k2 = b - 1.0;
        k3 = a;
        k4 = a + 1.0;
        k5 = 1.0;
        k6 = a + b;
        k7 = a + 1.0;
        k8 = a + 2.0;
        pkm2 = 0.0;
        qkm2 = 1.0;
        pkm1 = 1.0;
        qkm1 = 1.0;
        z = x / (1.0 - x);
        ans = 1.0;
        r = 1.0;
        n = 0;
        thresh = 3.0 * $M.eps;
        do {
            xk = -(z * k1 * k2 / (k3 * k4));
            pk = pkm1 + pkm2 * xk;
            qk = qkm1 + qkm2 * xk;
            pkm2 = pkm1;
            pkm1 = pk;
            qkm2 = qkm1;
            qkm1 = qk;
            xk = z * k5 * k6 / (k7 * k8);
            pk = pkm1 + pkm2 * xk;
            qk = qkm1 + qkm2 * xk;
            pkm2 = pkm1;
            pkm1 = pk;
            qkm2 = qkm1;
            qkm1 = qk;
            if (qk != 0) {
                r = pk / qk;
            }
            if (r != 0) {
                t = Math.abs((ans - r) / r);
                ans = r;
            }
            else {
                t = 1.0;
            }
            if (t < thresh) {
                break;
            }
            k1 = k1 + 1.0;
            k2 = k2 - 1.0;
            k3 = k3 + 2.0;
            k4 = k4 + 2.0;
            k5 = k5 + 1.0;
            k6 = k6 + 1.0;
            k7 = k7 + 2.0;
            k8 = k8 + 2.0;
            if (Math.abs(qk) + Math.abs(pk) >big) {
                pkm2 = pkm2 * biginv;
                pkm1 = pkm1 * biginv;
                qkm2 = qkm2 * biginv;
                qkm1 = qkm1 * biginv;
            }
            if (Math.abs(qk) < biginv || Math.abs(pk) < biginv) {
                pkm2 = pkm2 * big;
                pkm1 = pkm1 * big;
                qkm2 = qkm2 * big;
                qkm1 = qkm1 * big;
            }
            n = n+1;
        }
        while(n != 300);
        return ans;
    },
    
    incompletebeta: function(a, b, x) {
        var t, xc, w, y, flag = 0,
            big = 4.503599627370496e15,
            biginv = 2.22044604925031308085e-16,
            maxgam = 171.624376956302725,
            minlog = Math.log(Number.MIN_VALUE),
            maxlog = Math.log(Number.MAX_VALUE);

            if (x == 0) {
                return 0;
            }
            if (x == 1) {
                return 1;
            }
            if (b * x <= 1.0 && x <= 0.95) {
                return this.incompletebetaps(a, b, x, maxgam);
            }
            w = 1.0 - x;
            if (x > a / (a + b)) {
                flag = 1;
                t = a;
                a = b;
                b = t;
                xc = x;
                x = w;
            }
            else {
                xc = w;
            }
            if ((flag == 1 && b * x <= 1.0) && x <= 0.95) {
                t = this.incompletebetaps(a, b, x, maxgam);
                return (t <= $M.eps)? 1.0 - $M.eps : 1.0 - t;  
            }
            y = x * (a + b - 2.0) - (a - 1.0);
            if (y < 0.0) {
                w = this.incompletebetafe(a, b, x, big, biginv);
            }
            else {
                w = this.incompletebetafe2(a, b, x, big, biginv) / xc;
            }
            y = a * Math.log(x);
            t = b * Math.log(xc);
            if ((a + b < maxgam && Math.abs(y) < maxlog) && Math.abs(t) < maxlog) {
                t = Math.pow(xc, b);
                t = t * Math.pow(x, a);
                t = t / a;
                t = t * w;
                t = t * (this.gammafunction(a + b) / (this.gammafunction(a) * this.gammafunction(b)));
                if (flag == 1) {
                    return (t <= $M.eps)? 1.0 - $M.eps : 1.0 - t;
                }
                else {
                    return t;
                }                
            }
            y = y + t + this.lngamma(a + b) - this.lngamma(a) - this.lngamma(b);
            y = y + Math.log(w / a);
            if (y < minlog) {
                t = 0.0;
            }
            else {
                t = Math.exp(y);
            }
            if (flag == 1) {
                t = (t < $M.eps)? 1.0 - $M.eps : 1.0 - t;
            }
            return t;
    },
    
    fdistr: function(a, b, x) {
        return this.incompletebeta(0.5 * a, 0.5 * b, a * x / (b + a * x));
    },
    
    //Inverse Normal Distribution
    iND: function(y0) {
        var expm2, s2pi, x, y, z, y2, x0, x1, code, p0, q0, p1, q1, p2, q2;

        expm2 = 0.13533528323661269189;
        s2pi = 2.50662827463100050242;
        if (y0 <= 0) {
            return -Infinity              
        }
        
        if (y0 >= 1){
            return Infinity;
        }

        code = 1;
        y = y0;
        if (y > 1.0 - expm2) {
            y = 1.0 - y;
            code = 0;
        }
        if (y > expm2) {
            y = y - 0.5;
            y2 = y * y;
            p0 = -59.9633501014107895267;
            p0 = 98.0010754185999661536 + y2 * p0;
            p0 = -56.6762857469070293439 + y2 * p0;
            p0 = 13.9312609387279679503 + y2 * p0;
            p0 = -1.23916583867381258016 + y2 * p0;
            q0 = 1;
            q0 = 1.95448858338141759834 + y2 * q0;
            q0 = 4.67627912898881538453 + y2 * q0;
            q0 = 86.3602421390890590575 + y2 * q0;
            q0 = -225.462687854119370527 + y2 * q0;
            q0 = 200.260212380060660359 + y2 * q0;
            q0 = -82.0372256168333339912 + y2 * q0;
            q0 = 15.9056225126211695515 + y2 * q0;
            q0 = -1.18331621121330003142 + y2 * q0;
            x = y + y * y2 * p0 / q0;
            x = x * s2pi;
            return x;
        }
        x = Math.sqrt(-2.0 * Math.log(y));
        x0 = x - Math.log(x) / x;
        z = 1.0 / x;
        if (x < 8.0) {
            p1 = 4.05544892305962419923;
            p1 = 31.5251094599893866154 + z * p1;
            p1 = 57.1628192246421288162 + z * p1;
            p1 = 44.0805073893200834700 + z * p1;
            p1 = 14.6849561928858024014 + z * p1;
            p1 = 2.18663306850790267539 + z * p1;
            p1 = -(1.40256079171354495875 * 0.1) + z * p1;
            p1 = -(3.50424626827848203418 * 0.01) + z * p1;
            p1 = -(8.57456785154685413611 * 0.0001) + z * p1;
            q1 = 1;
            q1 = 15.7799883256466749731 + z * q1;
            q1 = 45.3907635128879210584 + z * q1;
            q1 = 41.3172038254672030440 + z * q1;
            q1 = 15.0425385692907503408 + z * q1;
            q1 = 2.50464946208309415979 + z * q1;
            q1 = -(1.42182922854787788574*0.1) + z * q1;
            q1 = -(3.80806407691578277194*0.01) + z * q1;
            q1 = -(9.33259480895457427372*0.0001) + z * q1;
            x1 = z * p1 / q1;
        }
        else {
            p2 = 3.23774891776946035970;
            p2 = 6.91522889068984211695 + z * p2;
            p2 = 3.93881025292474443415 + z * p2;
            p2 = 1.33303460815807542389 + z * p2;
            p2 = 2.01485389549179081538 * 0.1 + z * p2;
            p2 = 1.23716634817820021358 * 0.01 + z * p2;
            p2 = 3.01581553508235416007 * 0.0001 + z * p2;
            p2 = 2.65806974686737550832 * 0.000001 + z * p2;
            p2 = 6.23974539184983293730 * 0.000000001 + z * p2;
            q2 = 1;
            q2 = 6.02427039364742014255 + z * q2;
            q2 = 3.67983563856160859403 + z * q2;
            q2 = 1.37702099489081330271 + z * q2;
            q2 = 2.16236993594496635890 * 0.1 + z * q2;
            q2 = 1.34204006088543189037 * 0.01 + z * q2;
            q2 = 3.28014464682127739104 * 0.0001 + z * q2;
            q2 = 2.89247864745380683936 * 0.000001 + z * q2;
            q2 = 6.79019408009981274425 * 0.000000001 + z * q2;
            x1 = z * p2 / q2;
        }
        x = x0 - x1;
        if (code!=0) {
            x = -x;
        }
        return x;
    },
    
    Info: function(x) {
        return (x == 0)? 0 : x * Math.log(1/x) / Math.LN2;        
    },
    
    JBTest: function(x) {
        var n = x.length;
        if (n < 5) {
            return p = 1.0;
        }
        s = JB.Stat(x);
        return {JB: s, p: JB.Approx(n, s)};
    },
    
    chisquare: function(x, d) {
        return (x == Infinity)? 0 : this.incompletegammac(d / 2, x / 2);
    },
    
    chisquareTest: function(o, e) {
       var chi = 0, len = o.length;
       for (var i = 0; i < len; i++) {
          chi += (o[i] - e[i]) * (o[i] - e[i]) / e[i];
       }
       return {chi: chi, df: len -1, p: $M.chisquare(chi, len - 1)};
    },
    
    FicherExact: function(table) {
        var i_min = 0, j_min = 0;
        if (table[0][1] < table[i_min][j_min]) {i_min = 0; j_min = 1}; 
        if (table[1][0] < table[i_min][j_min]) {i_min = 1; j_min = 0};
        if (table[1][1] < table[i_min][j_min]) {i_min = 1; j_min = 1};
        var t = [table[0][0] + table[0][1], table[1][0] + table[1][1], table[0][0] + table[1][0], table[0][1] + table[1][1]];
        var x = t[0] + t[1];
        var pre = this.lngamma(1+t[0])+this.lngamma(1+t[1])+this.lngamma(1+t[2]) + this.lngamma(1+t[3]) - this.lngamma(1+x);
        var loc = [[table[0][0], table[0][1]],[table[1][0], table[1][1]]];
        var p = 0;
        for (var i = table[i_min][j_min]; i >= 0; i--) {
            p += Math.exp(pre - this.lngamma(1+loc[0][0])-this.lngamma(1+loc[0][1])-this.lngamma(1+loc[1][0])-this.lngamma(1+loc[1][1]));
            loc[1-i_min][1-j_min]--;
            loc[i_min][j_min]--;
            loc[1-i_min][j_min]++;
            loc[i_min][1-j_min]++;
        }
        return {p: p};        
    },
    
    pearsonCorr: function(x, y) {
        var corr, xmean = 0, ymean = 0, s = 0, xv = 0, yv = 0, t1, t2, n = x.length;

        for (var i = 0; i < n; i++) {
            xmean = xmean + x[i];
            ymean = ymean + y[i];
        }
        xmean = xmean / n;
        ymean = ymean / n;

        for (var i = 0; i < n; i++) {
            t1 = x[i] - xmean;
            t2 = y[i] - ymean;
            xv = xv + t1 * t1;
            yv = yv + t2 * t2;
            s = s + t1 * t2;
        }
        if (xv == 0 || yv == 0) {
            corr = 0;
        }
        else {
            corr = s / (Math.sqrt(xv) * Math.sqrt(yv));
        }
        var T = T = Math.abs(corr) / Math.sqrt(1 - corr * corr) * Math.sqrt(n - 2);
        var p = this.tdistribution(T, n - 2);
        if (p > 1 - p) p = 1 - p;
        p *= 2;
        
        return {corr: corr, p: p};
    },
    
    rank: function(x) {
        var i, j, k, t, tmp, tmpi, r = [], c = [], n = x.length;
        for (i = 0; i < n; i++) {
            r[i] = x[i];
            c[i] = i;
        }

        i = 2;
        do {
            t = i;
            while (t != 1) {
                k = Math.floor(t / 2);
                if (r [k-1] >= r[t-1]) {
                    t = 1;
                }
                else {
                    tmp = r[k-1];
                    r[k-1] = r[t-1];
                    r[t-1] = tmp;
                    tmpi = c[k-1];
                    c[k-1] = c[t-1];
                    c[t-1] = tmpi;
                    t = k;
                }
            }
            i = i + 1;
        }
        while (i <= n);
        
        i = n - 1;
        do {
            tmp = r[i];
            r[i] = r[0];
            r[0] = tmp;
            tmpi = c[i];
            c[i] = c[0];
            c[0] = tmpi;
            t = 1;
            while (t != 0) {
                k = 2 * t;
                if (k > i) {
                    t = 0;
                }
                else {
                    if (k < i) {
                        if (r[k] > r[k-1]) {
                            k = k+1;
                        }
                    }
                    if (r[t-1] >= r[k-1]) {
                        t = 0;
                    }
                    else {
                        tmp = r[k-1];
                        r[k-1] = r[t-1];
                        r[t-1] = tmp;
                        tmpi = c[k-1];
                        c[k-1] = c[t-1];
                        c[t-1] = tmpi;
                        t = k;
                    }
                }
            }
            i = i-1;
        } while (i >= 1);
            
        i = 0;
        while (i <= n - 1) {
            j = i + 1;
            while (j <= n-1) {
                if (r[j] != r[i]) {
                    break;
                }
                j = j + 1;
            }
            for (k = i; k <= j - 1; k++) {
                r[k] = 1 + ((i + j - 1) / 2.0);
            }
            i = j;
        }
        
        var result = []
            
        for(i = 0; i <= n - 1; i++) {
            result[c[i]] = r[i];
        }
        return result;
    },
    
    regression: function(x, y) {
        var sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, n = x.length;
        for (var i = 0; i < n; i++) {
            sx += x[i];
            sy += y[i];
            sxx += x[i] * x[i];
            syy += y[i] * y[i];
            sxy += x[i] * y[i];
        }
        var beta = (n * sxy - sx * sy) / (n * sxx - sx * sx);
        var alpha = sy / n - beta * sx / n;
        
        var SSR = 0, SSE = 0;
        for (var i = 0; i < n; i++) {
            SSR += (beta * x[i] + alpha - sy / n) * (beta * x[i] + alpha - sy / n);
            SSE += (beta * x[i] + alpha - y[i]) * (beta * x[i] + alpha - y[i]); 
        }
        var r2 = SSR / (SSR + SSE);
        var F = SSR / SSE * (n - 2);
        
        return {beta: beta, alpha: alpha, r2: r2, p: 1 - this.fdistr(1, n - 2, F)}
    },
    
    spearmanCorr: function(x, y) {
        var rankx = this.rank(x), ranky = this.rank(y);
        return this.pearsonCorr(rankx, ranky);    
    },
    
    uncertaintyC: function(table) {
        var sumRows = [];
        var sumCols = [];
        var n = 0;
        for (var i = 0; i < table.length; i++) {
            for (var j = 0; j < table[0].length; j++) {
                if (!sumRows[i]) sumRows[i] = 0;
                if (!sumCols[j]) sumCols[j] = 0;
                sumRows[i] += table[i][j];
                sumCols[j] += table[i][j];
                n += table[i][j];
            }
        }
        var Hfirst = 0;
        for (var i = 0; i < sumRows.length; i++) {
            Hfirst += this.Info(sumRows[i] / n);
        }
        var Hsecond = 0;
        for (var i = 0; i < sumCols.length; i++) {
            Hsecond += this.Info(sumCols[i] / n);
        }

        var Hboth = 0;
        for (var i = 0; i < sumRows.length; i++) {
            for (var j = 0; j < sumCols.length; j++) {
                Hboth += this.Info(table[i][j] / n);
            }
        }
        var I = Hfirst + Hsecond - Hboth;
        return {first: I / Hfirst, second: I / Hsecond, both: 2 * I / (Hfirst + Hsecond)}
    },
    
    tdistribution: function(t, k) {
        var x, rk, z, f, tz, p, xsqk, j;

        if (t == 0) {
            return 0.5
        }
        if (t < -2.0) {
                rk = k;
                z = rk / (rk + t * t);
                result = 0.5 * this.incompletebeta(0.5 * rk, 0.5, z);
                return result;
        }
        x = (t < 0)? -t : t;
        rk = k;
        z = 1.0 + x * x / rk;
        if (k % 2 != 0) {
            xsqk = x / Math.sqrt(rk);
            p = Math.atan(xsqk);
            if (k > 1) {
                f = 1.0;
                tz = 1.0;
                j = 3;
                while (j <= k - 2 && (tz / f) > $M.eps) {
                    tz = tz * ((j - 1) / (z * j));
                    f = f + tz;
                    j = j + 2;
                }
                p = p + f * xsqk / z;
            }
            p = p * 2.0 / Math.PI; 
        }
        else {
           f = 1.0;
           tz = 1.0;
           j = 2;
           while (j <= k - 2 && (tz / f) > $M.eps) {
               tz = tz * ((j-1) / (z*j));
               f = f + tz;
               j = j + 2;
           }
           p = f * x / Math.sqrt(z * rk);
        }
        if (t < 0) {
            p = -p;
        }
        return 0.5 + 0.5 * p;
    },
    
    tTest: function(x, m0) {
        var mean = this.mean(x),
            std = this.std(x, mean),
            len = x.length,
            t = (this.mean(x) - m0) / std * Math.sqrt(len),
            p = this.tdistribution(t, len - 1);
            
        return {t: t, df: len - 1, p: ((p > 0.5)? 1 - p : p)}; 
    },
    
    tTest2: function(x, y) {
        var mean1 = this.mean(x),
            mean2 = this.mean(y),
            std1 = this.std(x, mean1),
            std2 = this.std(y, mean2),
            n1 = x.length,
            n2 = y.length;
       
        var s12 = Math.sqrt(((n1 - 1) * std1 * std1  + (n2 - 1) *  std2 * std2) / (n1 + n2 -2 ));
        var t = (mean1 - mean2) / s12 / Math.sqrt(1 / n1 + 1 / n2);
        var df = n1 + n2 - 2;    
        var p = this.tdistribution(t, df);
            
        return {t: t, df: df, p: ((p > 0.5)? 2 * (1 - p) : 2 * p)}; 
    },
    
    UTest: function(x, y) {
        return U.test(x, y);
    },
    
    WTest: function(x, m0) {
        return W.test(x, m0);
    },
    
    mean: function(x) {
        var sum = 0, len = x.length;
        for (var i = 0; i < len; i++) {
            sum += x[i];
        }
        return sum / len;
    },
    
    variance: function(x, mean) {
        if (arguments.length == 1) {
            mean = this.mean(x);
        }
        var n = x.length, v1 = 0, v2 = 0;
        for (var i = 0; i < n; i++) {
            v1 = v1 + (x[i] - mean) * (x[i] - mean); 
        }
        for (var i = 0; i < n; i++) {
            v2 = v2 + (x[i] - mean);
        }
        v2 = v2 * v2 / n;
        var result = (v1 - v2) / (n - 1);
        return (result < 0)? 0 : result;
    },
    
    std: function(x, mean) {
        if (arguments.length == 1) {
            mean = this.mean(x);
        }
        
        return Math.sqrt(this.variance(x, mean));
    },
    
    quantile: function(values, p) {
        var H = (values.length - 1) * p + 1,
        h = Math.floor(H),
        v = values[h - 1],
        e = H - h;
        return e ? v + e * (values[h] - v) : v;
    },
    
    cross: function(table) {
        var row = [], col = [], N = 0, r = table.length, c = table[0].length;
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                if (!row[i]) row[i] = 0;
                if (!col[j]) col[j] = 0;
                row[i] += table[i][j];
                col[j] += table[i][j];
                N += table[i][j];
            }
        }
        
        var chi = 0, exp = 0;
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                exp = row[i]*col[j] / N;
                chi += (table[i][j] - exp) * (table[i][j] - exp) / exp;
            }
        }
        return {chi: chi, df: (r-1)*(c-1), p: $M.chisquare(chi, (r-1)*(c-1))};
    },
    
    ANOVA: function(values) {
        var len = values.length, means = [], mean = 0, tot = 0;
        for (var i = 0; i < len; i++) {
            means.push($M.mean(values[i]));
            mean += means[i] * values[i].length;
            tot += values[i].length;
        }
        mean = mean / tot;
        var SSb = 0;
        for (var i = 0; i < len; i++) {
            SSb += values[i].length * (means[i] - mean) * (means[i] - mean);
        }
        var dfb = len - 1;
        var SSw = 0;
        var dfw = 0;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < values[i].length; j++) {
                SSw += (values[i][j] - means[i]) * (values[i][j] - means[i]);
            }
            dfw += values[i].length - 1;
        }
        var F = (SSb / dfb) / (SSw / dfw);
        return {SSb: SSb, SSw: SSw, dfb: dfb, dfw: dfw, F: F, p: 1 - this.fdistr(dfb, dfw, F)}
    }
}

var temp1 = 1.0, temp2, eps;
do {
    eps = temp1;
    temp1 /= 2.0;
    temp2 = 1.0 + temp1;
} while (temp2 > 1.0); 
$M.eps = eps;