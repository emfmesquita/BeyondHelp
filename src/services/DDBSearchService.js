
import $ from "jquery";
import TooltipEntry from "../data/TooltipEntry";

const url = (name: string, path: string) => `https://www.dndbeyond.com/${path}?filter-search=${encodeURI(trim(name))}&sort=name`;
const baseUrl = (type: string) => `https://www.dndbeyond.com/${type}`;
const creationUrl = (name: string, type: string) => `https://www.dndbeyond.com/my-creations?filter-type=${type}&filter-name=${encodeURI(trim(name))}&sort=name`;
const collectionUrl = (name: string, type: string) => `https://www.dndbeyond.com/my-collection?filter-type=${type}&filter-name=${encodeURI(trim(name))}&sort=name`;

const trim = (value: string) => value ? value.trim() : "";

const commonParse = (el: HTMLElement) => trim(el.textContent);

const homebrewCreationParse = function (el: HTMLElement): TooltipEntry {
    const name = trim(el.textContent);
    const jqEl = $(el);
    const jqRow = $(el).closest(".list-row");
    const path = `/${jqRow.attr("data-type")}/${jqRow.attr("data-slug")}`;
    const author = jqRow.find(".list-row-author-primary-text").text();
    return new TooltipEntry(name, path, author);
};

const characterParse = function (el: HTMLElement): TooltipEntry {
    const name = trim(el.textContent);
    const jqRow = $(el).closest(".list-row");
    const path = `/${jqRow.attr("data-type")}/${jqRow.attr("data-slug")}`;
    return new TooltipEntry(name, path);
};

const homebrewCollectionParse = function (el: HTMLElement): TooltipEntry {
    const entry = characterParse(el);

    const jqRow = $(el).closest(".list-row");
    const authorText = jqRow.find(".list-row-name-secondary-text").text();
    entry.author = trim(authorText.substring(0, authorText.lastIndexOf("-")));

    entry.version = trim(jqRow.find(".list-row-version-primary-text").text());
    return entry;
};

const baseSearch = function (url: string, selector: string, parser: Function) {
    return new Promise((resolve, reject) => {
        $.get(url, (response) => {
            const html = $.parseHTML(response);
            const results = [];
            $(html).find(selector).each((idx, el) => results.push(parser(el)));
            resolve(results);
        }).fail(() => reject());
    });
};

const commonSearch = (url: string, selector: string) => baseSearch(url, selector, commonParse);
const homebreCreationSearch = (url: string) => baseSearch(url, ".list-row-name-primary-text a", homebrewCreationParse);
const homebreCollectionSearch = (url: string) => baseSearch(url, ".list-row-name-primary-text a", homebrewCollectionParse);
const characterSearch = (url: string) => baseSearch(url, ".list-row-name-primary-text a", characterParse);

class DDBSearchService {
    static backgrounds(): Promise<TooltipEntry[]> {
        return characterSearch(baseUrl("backgrounds"));
    }

    static equipments(name: string): Promise<string[]> {
        return commonSearch(url(name, "equipment"), ".list-row-name-primary-text a");
    }

    static feats(): Promise<TooltipEntry[]> {
        return characterSearch(baseUrl("feats"));
    }

    static magicItems(name: string): Promise<string[]> {
        return commonSearch(url(name, "magic-items"), ".item-name a");
    }

    static monsters(name: string): Promise<string[]> {
        return commonSearch(url(name, "monsters"), ".monster-name a");
    }

    static spells(name: string): Promise<string[]> {
        return commonSearch(url(name, "spells"), ".spell-name a");
    }

    static homebrewBackgrounds(name: string): Promise<TooltipEntry[]> {
        return homebreCreationSearch(creationUrl(name, "1669830167"));
    }

    static homebrewFeats(name: string): Promise<TooltipEntry[]> {
        return homebreCreationSearch(creationUrl(name, "1088085227"));
    }

    static homebrewMagicItems(name: string): Promise<TooltipEntry[]> {
        return homebreCreationSearch(creationUrl(name, "112130694"));
    }

    static homebrewMonsters(name: string): Promise<TooltipEntry[]> {
        return homebreCreationSearch(creationUrl(name, "779871897"));
    }

    static homebrewSpells(name: string): Promise<TooltipEntry[]> {
        return homebreCreationSearch(creationUrl(name, "1118725998"));
    }

    static homebrewCollectionBackgrounds(name: string): Promise<TooltipEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "1669830167"));
    }

    static homebrewCollectionFeats(name: string): Promise<TooltipEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "1088085227"));
    }

    static homebrewCollectionMagicItems(name: string): Promise<TooltipEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "112130694"));
    }

    static homebrewCollectionMonsters(name: string): Promise<TooltipEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "779871897"));
    }

    static homebrewCollectionSpells(name: string): Promise<TooltipEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "1118725998"));
    }
}

export default DDBSearchService;