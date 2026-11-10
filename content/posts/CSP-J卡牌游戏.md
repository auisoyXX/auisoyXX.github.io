+++
data = '2026-11-10'
draft = true
title = 'CSP-J2026纸牌游戏题解'
categories = ['算法设计']
tags = ['图论'，‘树上问题’，‘DP’]
+++
# 扎啤也能看懂(此处存疑)的纸牌游戏题解
## 题面
传送门[P17830 [CSP-J 2026] 纸牌游戏 / card（官方数据）](https://www.luogu.com.cn/problem/P17830)
大意是有n张牌，m种点数，每局按顺序打出一张牌，若此前有点数相同的牌，则将前一张点数相同牌包括其在内的之后所有牌拿走，将后打出的点数相同的牌留下。第i局跳过前i-1张牌，最后求每一种点数m最后能有几局满足m最终留在场上。

## 初步分析
不难发现对任意一张牌$a_i$,若存在$a_j$ $(i<j)$,则i到j这一段都可以忽略不计，直接从$a_j$开始往后推。据此，我们想到了建图方式。对于顺序输入的n张牌$a_i,1<=i<=n$,先按顺序从1到n连一条路，前后两个点之间以有向边连接。用数组储存上一次$a_j$值出现的下标记为i，并将$a_i$与$a_{i+1}$之间的边断开，连到
$a_j$上，完成建图。对于第i局，我们只需要从$a_i$开始遍历图，图中走过的点即是最终会留在桌上的点数。时间复杂度最坏应该是$O_{(mn)}$（对m个点数，每个都跑了一遍n的图）

## 优化
对于题目给的数据，mn很有可能会TLE(我猜的)，那么我们可以将其优化。对每一个点数。跑n遍的效率实在有点低下。不妨假设一个点n+1,所有的点最终都会通过路到达n+1这个终点，如果某个点a可以到达n+1,那么a的值就会最终留在桌面。同时，每个点最多只有一条出边，我们把它翻过来就会发现，这其实是一棵树。假设点数x最后出现的位置为$last_x$，那么毫无疑问$last_x$可以到达n+1,还有呢？当然是可以到达$last_x$的点，包括x之前出现的位置，以及所有x出现位置的前驱。事实上，我们发现，求x可以留下的局面数，就等价于求以$last_x$为根的树的大小。我们只需要用sz表示子树大小，fa表示某点父亲，那么$sz[fa[x]]$就等于其加上$sz[x]$.
```
    for(int i=1;i<=n;i++) sz[i]=1;
    for(int i=1;i<=n;i++){
        int fa=to[head[i]];
        sz[fa]+=sz[i];
    }
```
初始时，每个点子树大小都等于一。

## 完整代码实现
```
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
constexpr int N=5e5+5;
int n,m,a[N],cnt=-1,head[N*2],to[2*N],nxt[2*N],pr[N],sz[N];
void addedge(int u,int v){
    to[++cnt]=v;
    nxt[cnt]=head[u];
    head[u]=cnt;
}
int main(){
    std::ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    memset(head,-1,sizeof(head));
    memset(pr,0,sizeof(pr));
    cin>>n>>m;
    for(int i=1;i<=n;i++){
        cin>>a[i];
    }
    for(int i=1;i<=n;i++){
        addedge(i,i+1);
        if(pr[a[i]]){
            to[head[pr[a[i]]]]=i;
        }
        pr[a[i]]=i;
    }
    for(int i=1;i<=n;i++) sz[i]=1;
    for(int i=1;i<=n;i++){
        int fa=to[head[i]];
        sz[fa]+=sz[i];
    }
    for(int i=1;i<=m;i++){
        cout<<sz[pr[i]]<<" ";
    }
    return 0;
}
```

## DP思路
即使标签里有DP我也没想出来怎么用DP做。。。通过以上的分析，我们不难注意到，对于同一点数x，若在i和j$（i<j）$都出现，那么从i开始的终局和从j开始的终局相同。据此，我们可以把n中状态压缩到m种状态，即只考虑$last_x$ $1<=x<=m$开始的状态。那么,我们可以得到以下状态转移方程。
$$
\boxed{dp[x]=\{x\}\cup dp[next[x]]}
$$
表示x开始留在桌面上的点数就是x和从x后开一把得到结果的加和。
经常被DP抽陀螺的朋友都知道，这个转移方程对集合进行操作，所以不方便实现，需要我们换个思路。如果我们定义f[x]为最终桌面会留下数字x的游戏数量，不难得出

$$
\boxed{
f[x]=cnt[x]+\sum_{next[y]=x}f[y]
}
$$
注意到这坨的计算思路其实和之前做子树贡献统计是差球不多的，懒得写代码了。