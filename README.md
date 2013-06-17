Museum of Lobby Art
===================

Corporate office tower lobbies are not exactly the first places you think of when you want to see top-notch modern and contemporary art.
However, large corporations often have outstanding art collections and use their building lobbies and plazas as venues to display a selection of their works.
This online museum catalogs some of the highlights of corporate art collections on display in Manhattan.

[View the interactive map](http://brendanberg.github.io/lobby-art/).


Resources
---------

New York City has a number of excellent public arts programs.

- [Public Art Fund](http://www.publicartfund.org)
- [Percent for Art](http://www.nyc.gov/html/dcla/html/panyc/panyc.shtml)


Contributing
------------

While I try to document everything I can, there's no way one person can find every single work of art worth documenting in Manhattan.
I will gladly review any submissions of works to include, but I intend to keep the official fork tightly curated.

All documented locations are geoJSON features using the format described below.
Each location should include additional metadata in the properties dictionary.

    {
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [<LNG>, <LAT>]},
      "properties": {
        "feature-type": "<FEATURE-TYPE>",
        "Location": "<BUILDING-NAME>",
        "Address": "<BUILDING-ADDRESS>",
        "Artist": "<ARTIST-NAME>",
        "Title": "<WORK-TITLE>",
        "Image": "<WORK-IMAGE-URL>"
      }
    }

At a minimum, the metadata requires either a location or an address, the artist's name, and the title of the work.
Additionally, the URL for a Creative-Commons licensed image may be included.

The `feature-type` property determines the marker color in the map interface and is one of
"private-lobby", "private-outdoor", "public-lobby", or "public-outdoor".

To submit additional points of interest, fork the project, add data points, and submit a pull request.
