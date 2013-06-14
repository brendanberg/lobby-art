Museum of Lobby Art
===================

Corporate office tower lobbies are not exactly the first places you think of when you want to see top-notch modern and contemporary art.
However, large corporations often have outstanding art collections and use their building lobbies and plazas as venues to display a selection of their works.
This online museum catalogs some of the highlights of corporate art collections on display in Manhattan.

[View the interactive map.](https://github.com/brendanberg/lobby-art/blob/master/data/art.geojson)

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
        "Location": "<BUILDING-NAME>",
        "Address": "<BUILDING-ADDRESS>",
        "Artist": "<ARTIST-NAME>",
        "Title": "<WORK-TITLE>",
        "Image": "<WORK-IMAGE-URL>"
      }
    }

At a minimum, the metadata requires either a location or an address, the artist's name, and the title of the work.
Additionally, the URL for a Creative-Commons licensed image may be included.

To submit additional points of interest, fork the project, add data points, and submit a pull request.
