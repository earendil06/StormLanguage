lazy val storm = (project in file("."))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    name := "engine",
    resolvers += Resolver.mavenLocal, resolvers += "Artima Maven Repository" at "http://repo.artima.com/releases",
    scalaVersion := "2.12.6",
    scalaJSUseMainModuleInitializer := true,


    libraryDependencies += "com.lihaoyi" %%% "upickle" % "0.6.6",
    libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.9.2",

    libraryDependencies += "info.cukes" % "cucumber-scala_2.11" % "1.2.4",
    libraryDependencies += "info.cukes" % "cucumber-junit" % "1.2.4",
    libraryDependencies += "junit" % "junit" % "4.12"
  )
