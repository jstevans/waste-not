# ♻️ waste-not

`waste-not` is a caching system for build pipelines, meant to enable tools to incrementalize their work. It supports caching based on changes to a single file, as well as based on changes to any upstream file in the dependency graph. 

[The `waste-not` package itself][pkg:waste-not] is a small integration of a set of subcomponents, also hosted in this repo. In addition to the main package, the `waste-not` repo comprises:

* [**A lightweight, extensible AST walker**][pkg:walker] and [**visitors**][pkg:visitors] for extracting dependencies from files.
* [**A dependency resolver**][pkg:dependencies] that converts dependencies into valid, normalized file paths.
* [**Dependency graph logic**][pkg:dependency-graph] that finds all of the direct and indirect dependencies for each file.
* [**Cache-building utilities**][pkg:cache] that abstract out file-system interactions for a higher-level caching tool.


[pkg:walker]:https://github.com/jstevans/waste-not/tree/master/packages/walker
[pkg:visitors]:https://github.com/jstevans/waste-not/tree/master/packages/visitors
[pkg:graph-hashes]:https://github.com/jstevans/waste-not/tree/master/packages/graph-hashes
[pkg:dependency-graph]:https://github.com/jstevans/waste-not/tree/master/packages/dependency-graph
[pkg:dependencies]:https://github.com/jstevans/waste-not/tree/master/packages/dependencies
[pkg:cache]:https://github.com/jstevans/waste-not/tree/master/packages/cache
[pkg:waste-not]:https://github.com/jstevans/waste-not/tree/master/packages/waste-not



**⚠️ WARNING:** This tool is still <span style='color:red'>very much</span> a work in progress. It is neither stable nor production-ready.